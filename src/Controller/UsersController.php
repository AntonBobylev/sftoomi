<?php

namespace App\Controller;

use App\Class\Contacts;
use App\Class\Fetcher;
use Doctrine\DBAL\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
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
                "disabled", "reset_password", "force_to_change_password",
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
     * @throws Exception
     */
    #[Route("/saveUser", name: "save_user")]
    public function saveUser(Request $request, Contacts $contacts): Response
    {
        try {
            $this->connection->beginTransaction();
            $contactId = $contacts->set(Fetcher::json($request->request->get("contacts")));

            $values = [
                "id"          => Fetcher::int($request->request->get("id")),
                "login"       => Fetcher::trim($request->request->get("login")),
                "reset_password"           => Fetcher::int($request->request->get("reset_password". false)),
                "force_to_change_password" => Fetcher::int($request->request->get("force_to_change_password", false)),
                "disabled"                 => Fetcher::int($request->request->get("disabled", false)),
                "last_name"   => Fetcher::trim($request->request->get("last_name"), ""),
                "first_name"  => Fetcher::trim($request->request->get("first_name"), ""),
                "contact_id"  => $contactId
            ];

            $result = $this->save(
                $request,
                $values,
                ["login"]
            );
        } catch (Exception $ex) {
            $this->connection->rollBack();

            throw $ex;
        }

        $this->connection->commit();

        return new JsonResponse([
            "id" => $result["id"]
        ]);

    }
}
