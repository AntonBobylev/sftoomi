<?php

namespace App\Controller;

use App\Class\Contacts;
use App\Class\Fetcher;
use App\Class\Mailer;
use App\Class\TemplateManager;
use App\Class\Utils\PasswordGenerator;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\DBAL\Exception;
use Random\RandomException;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

final class UsersController extends AppCrudController
{
    protected string $baseTable = "users";

    /**
     * @throws Exception
     */
    #[Route("/getUsers", name: "get_users")]
    public function getUsers(Request $request): Response
    {
        $patients = $this->getList(
            $request,
            ["id", "login", "last_name", "first_name", "roles", "created_at"]
        );

        return new JsonResponse([
            "data"  => $patients["data"],
            "total" => $patients["total"]
        ]);
    }

    /**
     * @throws Exception
     */
    #[Route("/getUser", name: "get_user")]
    public function getUserApi(Request $request, Contacts $contacts): Response
    {
        $data = [];
        if ($request->request->has("id")) {
            $data = $this->getOne($request, [
                "id", "login", "last_name", "first_name",
                "disabled", "force_to_change_password",
                "contact_id"
            ]);

            if (!empty($data)) {
                $data["contacts"] = $contacts->get($data["contact_id"]);
            }

            unset($data["contact_id"]);
        }

        return new JsonResponse([
            "data" => $data
        ]);
    }

    /**
     * @throws Exception|RandomException
     */
    #[Route("/saveUser", name: "save_user")]
    public function saveUser(
        Request $request,
        Contacts $contacts,
        UserPasswordHasherInterface $passwordHasher,
        Mailer $mailer,
        Filesystem $filesystem
    ): Response
    {
        try {
            $this->connection->beginTransaction();
            $contactId = $contacts->set(Fetcher::json($request->request->get("contacts")));

            $resetPassword = Fetcher::int($request->request->get("reset_password"), false);

            $values = [
                "id"          => Fetcher::int($request->request->get("id")),
                "login"       => Fetcher::trim($request->request->get("login")),
                "force_to_change_password" => $resetPassword ? true : Fetcher::int($request->request->get("force_to_change_password"), false),
                "disabled"                 => Fetcher::int($request->request->get("disabled"), false),
                "last_name"   => Fetcher::trim($request->request->get("last_name"), ""),
                "first_name"  => Fetcher::trim($request->request->get("first_name"), ""),
                "contact_id"  => $contactId,
                "roles"       => "[\"ROLE_USER\"]" // TODO: add the permissions system
            ];

            $isNewUser = empty($values["id"]);
            if ($isNewUser) {
                $password             = new PasswordGenerator()->generate();
                $hashedPassword       = $passwordHasher->hashPassword(new User(), $password);
                $values["password"]   = $hashedPassword;
                $values["created_at"] = $this->connection->fetchOne("select now()");
            }

            $result = $this->save(
                $request,
                $values,
                ["login"]
            );

            if ($resetPassword || $isNewUser) {
                $newPassword = new PasswordGenerator()->generate();

                $templateManager = new TemplateManager($filesystem);
                $templateContent = $templateManager->getTemplate("email/user-new-password.html");
                $mailContent = $templateManager->apply($templateContent, [
                    "password" => $newPassword
                ]);

                $mailer->applyTemplate($mailContent);

                $mailer->addAddresses(["anton.bobylev@emsow.com"]);
                $mailer->send();

                $this->connection->update(
                    "users",
                    [
                        "password"                 => $passwordHasher->hashPassword(new User(), $newPassword),
                        "force_to_change_password" => 1
                    ],
                    ["id" => $result["id"]]
                );
            }
        } catch (Exception $ex) {
            $this->connection->rollBack();

            throw $ex;
        }

        $this->connection->commit();

        return new JsonResponse([
            "id" => $result["id"]
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
            ["id" => $values["user_id"]]
        );

        return new JsonResponse([
            "success" => true
        ]);
    }
}
