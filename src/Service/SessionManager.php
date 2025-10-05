<?php

namespace App\Service;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class SessionManager
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    public function createSession(User $user): string
    {
        $connection = $this->entityManager->getConnection();
        $sessionId = bin2hex(random_bytes(64));
        $lifetime = time() + 3600;

        $sessionData = [
            'user_id' => $user->getId(),
            'login' => $user->getLogin(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'roles' => $user->getRoles()
        ];

        $connection->executeStatement(
            "INSERT INTO sessions (session_id, session_data, session_lifetime, session_time) VALUES (?, ?, ?, ?)",
            [
                $sessionId,
                serialize($sessionData),
                $lifetime,
                time()
            ]
        );

        return $sessionId;
    }

    public function validateSession(string $sessionId): ?array
    {
        $connection = $this->entityManager->getConnection();

        $session = $connection->executeQuery(
            "SELECT session_data FROM sessions WHERE session_id = ? AND session_lifetime > ?",
            [$sessionId, time()]
        )->fetchAssociative();

        if ($session) {
            // Обновляем время сессии
            $connection->executeStatement(
                "UPDATE sessions SET session_lifetime = ? WHERE session_id = ?",
                [time() + 3600, $sessionId]
            );

            return unserialize($session['session_data']);
        }

        return null;
    }

    public function deleteSession(string $sessionId): void
    {
        $connection = $this->entityManager->getConnection();
        $connection->executeStatement(
            "DELETE FROM sessions WHERE session_id = ?",
            [$sessionId]
        );
    }

    public function cleanupExpiredSessions(): void
    {
        $connection = $this->entityManager->getConnection();
        $connection->executeStatement(
            "DELETE FROM sessions WHERE session_lifetime <= ?",
            [time()]
        );
    }
}
