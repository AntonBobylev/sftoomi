<?php

namespace App\Controller;

use App\Class\Constants;
use App\Class\Contacts;
use App\Class\Core\DB\Connection as DBConnection;
use App\Class\Fetcher;
use App\Class\Messenger\User\ResetPassword\Message as ResetUserPasswordMessage;
use App\Class\Model\GroupModel;
use App\Class\Model\UserModel;
use App\Class\Utils\PasswordGenerator;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\DBAL\Exception;
use Random\RandomException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Messenger\Exception\ExceptionInterface;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

final class UsersController extends SftoomiController
{
    public function __construct(
        DBConnection $connection,
        private readonly Contacts $contacts,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly MessageBusInterface $messageBus
    )
    {
        parent::__construct($connection);
    }

    #[Route("/getUsers", name: "get_users")]
    public function getUsers(Request $request): Response
    {
        $userModel = new UserModel($this->connection);
        $users = $userModel->getAll(
            $request->request->get("start"),
            $request->request->get("limit")
        );

        foreach ($users["data"] as &$user) {
            $user["links"] = [
                "user_groups" => $this->getUserGroups($user["id"])
            ];
        }
        unset($user);

        return new JsonResponse([
            "data"  => $users["data"],
            "total" => $users["total"]
        ]);
    }

    /**
     * @throws Exception
     */
    #[Route("/getUser", name: "get_user")]
    public function getUserApi(Request $request): Response
    {
        $data = [];
        if ($request->request->has("id")) {
            $userModel = new UserModel($this->connection);

            $userId = Fetcher::int($request->request->get("id"));
            $data = $userModel->get($userId);

            if (!empty($data)) {
                $data["contacts"] = $this->contacts->get($data["contact_id"]);
                $data["user_groups"] = $this->getUserGroups($userId);
            }

            unset($data["contact_id"]);
        }

        return new JsonResponse([
            "data"  => $data,
            "lists" => [
                "groups" => new GroupModel($this->connection)->getAll()["data"]
            ]
        ]);
    }

    /**
     * @throws Exception|RandomException|ExceptionInterface
     */
    #[Route("/saveUser", name: "save_user")]
    public function saveUser(Request $request): Response
    {
        $contactId = $this->contacts->set(Fetcher::json($request->request->get("contacts")));

        $resetPassword = Fetcher::int($request->request->get("reset_password"), false);

        $values = [
            "id"          => Fetcher::int($request->request->get("id")),
            "login"       => Fetcher::trim($request->request->get("login")),
            "force_to_change_password" => $resetPassword ? 1 : Fetcher::int($request->request->get("force_to_change_password"), false),
            "disabled"                 => Fetcher::int($request->request->get("disabled"), false),
            "last_name"   => Fetcher::trim($request->request->get("last_name"), ""),
            "first_name"  => Fetcher::trim($request->request->get("first_name"), ""),
            "contact_id"  => $contactId
        ];

        $this->assertAllRequiredFieldsSet(["login"], $values);

        $isNewUser = empty($values["id"]);
        if ($isNewUser) {
            $password             = new PasswordGenerator()->generate();
            $hashedPassword       = $this->passwordHasher->hashPassword(new User(), $password);
            $values["password"]   = $hashedPassword;
            $values["created_at"] = $this->connection->now();
        }

        $this->connection->insupd(
            "users",
            $values,
            "id = :id",
            $values
        );

        $userId = $isNewUser ? $this->connection->getLastInsertId() : $values["id"];

        $userGroups = Fetcher::intArray($request->request->get("user_groups"), []);
        if (empty($userGroups)) {
            throw new \RuntimeException("At least one user group must be selected for the user");
        }

        $this->connection->delete(
            "users_groups",
            "user_id = ?",
            [$userId]
        );

        foreach ($userGroups as $groupId) {
            $this->connection->insert(
                "users_groups",
                [
                    "user_id"  => $userId,
                    "group_id" => $groupId
                ]
            );
        }

        if ($resetPassword || $isNewUser) {
            $this->resetUserPassword($userId, $this->getUserPrimaryEmail($userId));
        }

        return new JsonResponse([
            "id" => $userId
        ]);
    }

    #[Route("/changePassword", name: "change_password")]
    public function changePassword(
        Request $request,
        UserRepository $repository,
        UserPasswordHasherInterface $passwordHasher
    ): Response
    {
        $values = $request->request->all();
        if ($values["new_password"] !== $values["new_password_confirmation"]) {
            return new JsonResponse([
                "success" => false,
                "message" => "New password and confirmation must be equal"
            ]);
        }

        $this->assertAllRequiredFieldsSet([
            "user_id", "old_password", "new_password", "new_password_confirmation"
        ], $values);

        $user = $repository->find($values["user_id"]);
        if (empty($user)) {
            return new JsonResponse([
                "success" => false,
                "message" => "User not found"
            ]);
        }

        if (!password_verify($values["old_password"], $user->getPassword())) {
            return new JsonResponse([
                "success" => false,
                "message" => "Old password is incorrect"
            ]);
        }

        $this->connection->update(
            "users",
            [
                "password"                 => $passwordHasher->hashPassword(new User(), $values["new_password"]),
                "force_to_change_password" => 0
            ],
            "id = ?",
            [$values["user_id"]]
        );

        return new JsonResponse([
            "success" => true
        ]);
    }

    #[Route("/resetPassword", name: "reset_password")]
    public function resetPassword(Request $request): Response
    {
        $values = $request->request->all();

        $this->assertAllRequiredFieldsSet([
            "login", "email"
        ], $values);

        $sql = "select id
                from users
                where login = ?";
        $userId = $this->connection->selInt($sql, [$values["login"]]);

        $response = new JsonResponse([
            "message" => "The mail was sent to the email address you provided, if the current login-mail combination exists"
        ]);

        if (empty($userId)) {
            // User not exists

            return $response;
        }

        $userEmails = $this->getUserEmailsList($userId);

        if (!in_array($values["email"], $userEmails)) {
            // User doesn't have any emails or provided email is not in the user contacts list

            return $response;
        }

        $this->resetUserPassword($userId, $values["email"]);

        return new JsonResponse([
            "success" => true
        ]);
    }

    #[Route("/removeUser", name: "remove_user")]
    public function removeUser(Request $request, Contacts $contacts): Response
    {
        throw new \RuntimeException("Not implemented yet");
    }

    /**
     * @param int $userId
     * @param string $mail
     *
     * @return void
     *
     * @throws RandomException
     * @throws ExceptionInterface
     */
    private function resetUserPassword(int $userId, string $mail): void
    {
        $this->messageBus->dispatch(new ResetUserPasswordMessage(
            recipient: $mail,
            password:  new PasswordGenerator()->generate(),
            userId:    $userId
        ));
    }

    private function getUserEmailsList(int $userId): array
    {
        $sql = "select contact_id
                from users
                where id = ?";
        $contactId = $this->connection->selInt($sql, [$userId]);
        if (empty($contactId)) {
            return [];
        }

        $emails = $this->contacts->get($contactId, [Constants::CONTACT_TYPE_EMAIL]);
        if (empty($emails["contacts"])) {
            return [];
        }

        return array_map(function (array $contact) {
            return $contact["text"];
        }, $emails["contacts"]);
    }

    private function getUserPrimaryEmail(int $userId): string | null
    {
        return $this->getUserEmailsList($userId)[0];
    }

    private function getUserGroups(int $userId): array
    {
        $sql = "select g.id, g.name
                from users_groups ug
                    left join `groups` g on g.id = ug.group_id
                where ug.user_id = ?";

        return $this->connection->fetchAll($sql, [$userId]);
    }
}
