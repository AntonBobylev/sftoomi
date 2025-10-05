<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\SessionManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

final class AuthController extends AbstractController
{
    #[Route("/register", name: "register", methods: ["POST"])]
    public function register(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data["login"]) || !isset($data["password"])) {
            return new JsonResponse([
                "success" => false,
                "error"   => "Login and password are required"
            ], Response::HTTP_BAD_REQUEST);
        }

        $existingUser = $entityManager->getRepository(User::class)->findOneBy(["login" => $data["login"]]);
        if ($existingUser) {
            return new JsonResponse([
                "success" => false,
                "error"   => "User with this login already exists"
            ], Response::HTTP_CONFLICT);
        }

        $user = new User();
        $user->setLogin($data["login"]);

        $hashedPassword = $passwordHasher->hashPassword($user, $data["password"]);
        $user->setPassword($hashedPassword);

        $user->setRoles(["ROLE_USER"]);

        if (isset($data["firstName"])) {
            $user->setFirstName($data["firstName"]);
        }

        if (isset($data["lastName"])) {
            $user->setLastName($data["lastName"]);
        }

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse([
            "success" => true,
            "message" => "User created successfully",
            "user" => [
                "id"        => $user->getId(),
                "login"     => $user->getLogin(),
                "firstName" => $user->getFirstName(),
                "lastName"  => $user->getLastName(),
                "createdAt" => $user->getCreatedAt()->format("Y-m-d H:i:s")
            ]
        ], Response::HTTP_CREATED);
    }

    #[Route("/login", name: "login", methods: ["POST"])]
    public function login(
        Request $request,
        SessionManager $sessionManager,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $login = $data["login"] ?? "";
        $password = $data["password"] ?? "";

        $user = $entityManager->getRepository(User::class)->findOneBy(["login" => $login]);

        if (!$user || !password_verify($password, $user->getPassword())) {
            return new JsonResponse([
                "success" => false,
                "error"   => "Invalid credentials"
            ], Response::HTTP_UNAUTHORIZED);
        }

        $sessionId = $sessionManager->createSession($user);

        return new JsonResponse([
            "success"    => true,
            "message"    => "Login successful",
            "session_id" => $sessionId,
            "user" => [
                "id"        => $user->getId(),
                "login"     => $user->getLogin(),
                "firstName" => $user->getFirstName(),
                "lastName"  => $user->getLastName(),
                "roles"     => $user->getRoles()
            ]
        ]);
    }

    #[Route("/logout", name: "logout", methods: ["GET"])]
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
