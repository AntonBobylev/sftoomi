<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\SessionManager;
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
                "id" => $user->getId(),
                "login" => $user->getLogin(),
                "firstName" => $user->getFirstName(),
                "lastName" => $user->getLastName(),
                "createdAt" => $user->getCreatedAt()->format("Y-m-d H:i:s")
            ]
        ], Response::HTTP_CREATED);
    }

    #[Route("/login", name: "login_docs", methods: ["GET"])]
    public function loginDocs(): JsonResponse
    {
        return new JsonResponse([
            "message" => "Use POST method with JSON to login",
            "example" => [
                "method" => "POST",
                "url" => "/login",
                "content_type" => "application/json",
                "body" => [
                    "login" => "username",
                    "password" => "password"
                ]
            ]
        ]);
    }

    #[Route("/login", name: "login", methods: ["POST"])]
    public function login(): JsonResponse
    {
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
                "lastName" => $user->getLastName(),
                "roles" => $user->getRoles()
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

    #[Route("/logout", name: "logout", methods: ["GET"])]
    public function logout(SessionInterface $session): JsonResponse
    {
        // Получаем ID сессии до ее уничтожения (для отладки)
        $sessionId = $session->getId();

        // Полностью уничтожаем сессию
        $session->invalidate();
        $session->clear();

        // Убедимся что сессия закрыта
        if ($session->isStarted()) {
            $session->save();
        }

        return new JsonResponse([
            "success" => true,
            "message" => "Logout successful",
            "session_id" => $sessionId // Для отладки
        ]);
    }

    #[Route("/debug-sessions", name: "debug_sessions", methods: ["GET"])]
    public function debugSessions(EntityManagerInterface $entityManager): JsonResponse
    {
        $connection = $entityManager->getConnection();

        // Проверим существование таблицы
        try {
            $tableExists = $connection->executeQuery("SHOW TABLES LIKE 'sessions'")->fetchOne();

            if (!$tableExists) {
                return new JsonResponse(["error" => "Sessions table does not exist"], 500);
            }

            $sessions = $connection->executeQuery("SELECT session_id, session_lifetime, session_time FROM sessions")->fetchAllAssociative();

            return new JsonResponse([
                "table_exists" => true,
                "sessions_count" => count($sessions),
                "sessions" => $sessions
            ]);
        } catch (\Exception $e) {
            return new JsonResponse([
                "error" => $e->getMessage(),
                "table_exists" => false
            ], 500);
        }
    }

    #[Route("/debug-current-session", name: "debug_current_session", methods: ["GET"])]
    public function debugCurrentSession(SessionInterface $session): JsonResponse
    {
        return new JsonResponse([
            "session_id" => $session->getId(),
            "session_started" => $session->isStarted(),
            "session_data" => $session->all()
        ]);
    }

    #[Route("/debug-session-config", name: "debug_session_config", methods: ["GET"])]
    public function debugSessionConfig(): JsonResponse
    {
        return new JsonResponse([
            "session_save_path" => ini_get('session.save_path'),
            "session_handler" => ini_get('session.save_handler'),
            "session_name" => ini_get('session.name'),
            "session_gc_maxlifetime" => ini_get('session.gc_maxlifetime')
        ]);
    }

    #[Route("/debug-db-connection", name: "debug_db_connection", methods: ["GET"])]
    public function debugDbConnection(EntityManagerInterface $entityManager): JsonResponse
    {
        $connection = $entityManager->getConnection();

        try {
            $connection->connect();
            return new JsonResponse([
                "connected" => $connection->isConnected(),
                "database" => $connection->getDatabase()
            ]);
        } catch (\Exception $e) {
            return new JsonResponse([
                "connected" => false,
                "error" => $e->getMessage()
            ], 500);
        }
    }

    #[Route("/force-save-session", name: "force_save_session", methods: ["GET"])]
    public function forceSaveSession(SessionInterface $session): JsonResponse
    {
        $session->set('test_key', 'test_value');
        $session->save();

        return new JsonResponse([
            "session_id" => $session->getId(),
            "session_saved" => true
        ]);
    }

    #[Route("/debug-session-info", name: "debug_session_info", methods: ["GET"])]
    public function debugSessionInfo(): JsonResponse
    {
        $sessionHandler = ini_get('session.save_handler');
        $sessionPath = ini_get('session.save_path');

        return new JsonResponse([
            "session_save_handler" => $sessionHandler,
            "session_save_path" => $sessionPath,
            "session_gc_maxlifetime" => ini_get('session.gc_maxlifetime')
        ]);
    }














    #[Route("/login-db", name: "login_db", methods: ["POST"])]
    public function loginDb(
        Request $request,
        SessionManager $sessionManager,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $login = $data['login'] ?? '';
        $password = $data['password'] ?? '';

        $user = $entityManager->getRepository(User::class)->findOneBy(['login' => $login]);

        if (!$user || !password_verify($password, $user->getPassword())) {
            return new JsonResponse([
                "success" => false,
                "error" => "Invalid credentials"
            ], Response::HTTP_UNAUTHORIZED);
        }

        $sessionId = $sessionManager->createSession($user);

        return new JsonResponse([
            "success" => true,
            "message" => "Login successful",
            "session_id" => $sessionId,
            "user" => [
                "id" => $user->getId(),
                "login" => $user->getLogin(),
                "firstName" => $user->getFirstName(),
                "lastName" => $user->getLastName(),
                "roles" => $user->getRoles()
            ]
        ]);
    }

    #[Route("/me-db", name: "me_db", methods: ["GET"])]
    public function meDb(Request $request, SessionManager $sessionManager): JsonResponse
    {
        $sessionId = $request->headers->get('X-Session-ID');

        if (!$sessionId) {
            return new JsonResponse([
                "success" => false,
                "error" => "Session ID required"
            ], Response::HTTP_UNAUTHORIZED);
        }

        $sessionData = $sessionManager->validateSession($sessionId);

        if (!$sessionData) {
            return new JsonResponse([
                "success" => false,
                "error" => "Invalid or expired session"
            ], Response::HTTP_UNAUTHORIZED);
        }

        return new JsonResponse([
            "success" => true,
            "user" => $sessionData
        ]);
    }

    #[Route("/logout-db", name: "logout_db", methods: ["GET"])]
    public function logoutDb(Request $request, SessionManager $sessionManager): JsonResponse
    {
        $sessionId = $request->headers->get('X-Session-ID');

        if ($sessionId) {
            $sessionManager->deleteSession($sessionId);
        }

        return new JsonResponse([
            "success" => true,
            "message" => "Logout successful"
        ]);
    }
}
