<?php

namespace App\Controller;

use App\Class\Fetcher;
use App\Class\Model\UserModel;
use App\Service\SessionManager;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

final class AuthController extends SftoomiController
{
    #[Route("/login", name: "login", methods: ["POST"])]
    public function login(
        Request $request,
        SessionManager $sessionManager
    ): JsonResponse
    {
        $login = Fetcher::trim($request->request->get("login"));
        $password = Fetcher::trim($request->request->get("password"));

        $user = new UserModel($this->connection)->get(
            null,
            $this->connection->subst("login = ?", [$login])
        );

        if (empty($user)) {
            return new JsonResponse([
                "success" => false,
                "error"   => "Invalid credentials"
            ]);
        }

        $sql = "select password
                from users
                where id = ?";
        $userPassword = $this->connection->selString($sql, [$user["id"]]);

        if (!password_verify($password, $userPassword)) {
            return new JsonResponse([
                "success" => false,
                "error"   => "Invalid credentials"
            ]);
        }

        $sessionId = $sessionManager->createSession($user);

        return new JsonResponse([
            "success"    => true,
            "session_id" => $sessionId,
            "user"       => $user
        ]);
    }

    #[Route("/checkAuthorized", name: "check_authorized", methods: ["POST"])]
    public function checkAuthorized(Request $request, SessionManager $sessionManager): JsonResponse
    {
        $sessionId = Fetcher::trim($request->headers->get("X-Session-ID"));

        if (empty($sessionId)) {
            return new JsonResponse([
                "success" => false,
                "error"   => "Session ID required"
            ]);
        }

        $sessionData = $sessionManager->validateSession($sessionId);

        if (empty($sessionData)) {
            return new JsonResponse([
                "success" => false,
                "error"   => "Invalid or expired session"
            ]);
        }

        return new JsonResponse([
            "success" => true,
            "user"    => new UserModel($this->connection)->get($sessionData["id"])
        ]);
    }

    #[Route("/logout", name: "logout", methods: ["POST"])]
    public function logout(Request $request, SessionManager $sessionManager): JsonResponse
    {
        $sessionId = $request->headers->get("X-Session-ID");

        if ($sessionId) {
            $sessionManager->deleteSession($sessionId);
        }

        return new JsonResponse([
            "success" => true,
            "message" => "Logout successful"
        ]);
    }
}
