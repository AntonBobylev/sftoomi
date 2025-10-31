<?php

namespace App\Controller;

use App\Class\Fetcher;
use App\Entity\User;
use App\Service\SessionManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

final class AuthController extends AbstractController
{
    #[Route("/login", name: "login", methods: ["POST"])]
    public function login(
        Request $request,
        SessionManager $sessionManager,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        $login = Fetcher::trim($request->request->get("login"));
        $password = Fetcher::trim($request->request->get("password"));

        $user = $entityManager->getRepository(User::class)->findOneBy(["login" => $login]);

        if (!$user || !password_verify($password, $user->getPassword())) {
            return new JsonResponse([
                "success" => false,
                "error"   => "Invalid credentials"
            ]);
        }

        $sessionId = $sessionManager->createSession($user);

        return new JsonResponse([
            "success"    => true,
            "session_id" => $sessionId,
            "user"       => [
                "id"                       => $user->getId(),
                "login"                    => $user->getLogin(),
                "first_name"               => $user->getFirstName(),
                "last_name"                => $user->getLastName(),
                "roles"                    => $user->getRoles(),
                "force_to_change_password" => $user->isForceToChangePassword()
            ]
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
            "user"    => $sessionData
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
