<?php

namespace App\Controller;

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
    public function getUserApi(Request $request): Response
    {
        $data = [];
        if ($request->request->has("id")) {
            $data = $this->getOne($request, [
                "id", "login", "last_name", "first_name",
                "disabled", "reset_password", "force_to_change_password"
            ]);
        }

        return new JsonResponse([
            "data" => $data
        ]);
    }
}
