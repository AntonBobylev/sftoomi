<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class AuthController extends AbstractController
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
                "error" => "Login and password are required"
            ], Response::HTTP_BAD_REQUEST);
        }

        $existingUser = $entityManager->getRepository(User::class)->findOneBy(["login" => $data["login"]]);
        if ($existingUser) {
            return new JsonResponse([
                "success" => false,
                "error" => "User with this login already exists"
            ], Response::HTTP_CONFLICT);
        }

        $user = new User();
        $user->setLogin($data["login"]);
        $user->setPassword($passwordHasher->hashPassword($user, $data["password"]));
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
                "id" => $user->getId(),
                "login" => $user->getLogin(),
                "firstName" => $user->getFirstName(),
                "lastName" => $user->getLastName(),
                "createdAt" => $user->getCreatedAt()->format("Y-m-d H:i:s")
            ]
        ], Response::HTTP_CREATED);
    }

    #[Route("/login", name: "login", methods: ["GET"])]
    public function loginPage(): JsonResponse
    {
        // Для GET запроса просто возвращаем информацию о том, что нужно использовать POST
        return new JsonResponse([
            "message" => "Please use POST method to login",
            "example" => [
                "method" => "POST",
                "url" => "/login",
                "content_type" => "application/x-www-form-urlencoded",
                "body" => "login=username&password=password"
            ]
        ]);
    }

    #[Route("/login", name: "login_post", methods: ["POST"])]
    public function login(): JsonResponse
    {
        // Этот метод будет перехвачен Symfony Security
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse([
                "success" => false,
                "error" => "Authentication failed"
            ], Response::HTTP_UNAUTHORIZED);
        }

        return new JsonResponse([
            "success" => true,
            "message" => "Login successful",
            "user" => [
                "id" => $user->getId(),
                "login" => $user->getLogin(),
                "firstName" => $user->getFirstName(),
                "lastName" => $user->getLastName()
            ]
        ]);
    }

    #[Route("/me", name: "me", methods: ["GET"])]
    public function me(SessionInterface $session): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse([
                "success" => false,
                "error" => "Not authenticated"
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Обновляем время сессии
        $session->migrate(true, 3600);

        return new JsonResponse([
            "success" => true,
            "user" => [
                "id" => $user->getId(),
                "login" => $user->getLogin(),
                "firstName" => $user->getFirstName(),
                "lastName" => $user->getLastName(),
                "roles" => $user->getRoles(),
                "createdAt" => $user->getCreatedAt()->format("Y-m-d H:i:s")
            ]
        ]);
    }

    #[Route("/check-auth", name: "check_auth", methods: ["GET"])]
    public function checkAuth(SessionInterface $session): JsonResponse
    {
        $user = $this->getUser();

        if ($user) {
            $session->migrate(true, 3600);

            return new JsonResponse([
                "authenticated" => true
            ]);
        }

        return new JsonResponse([
            "authenticated" => false
        ], Response::HTTP_UNAUTHORIZED);
    }
}
