<?php

namespace App\Service;

use App\Entity\User;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;

final readonly class SessionManager
{
    private Connection $connection;
    
    public function __construct(private EntityManagerInterface $entityManager)
    {
        $this->connection = $this->entityManager->getConnection();
    }

    public function createSession(User $user): string
    {
        $sessionId = bin2hex(random_bytes(64));
        $lifetime = time() + 3600;

        $sessionData = [
            "user_id"   => $user->getId(),
            "login"     => $user->getLogin(),
            "firstName" => $user->getFirstName(),
            "lastName"  => $user->getLastName(),
            "roles"     => $user->getRoles()
        ];

        $this->connection->executeStatement(
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
        if (rand(1, 100) === 1) {
            $this->cleanupExpiredSessions();
        }

        $session = $this->connection->executeQuery(
            "SELECT session_data FROM sessions WHERE session_id = ? AND session_lifetime > ?",
            [$sessionId, time()]
        )->fetchAssociative();

        if ($session) {
            $this->connection->executeStatement(
                "UPDATE sessions SET session_lifetime = ? WHERE session_id = ?",
                [time() + 3600, $sessionId]
            );

            return unserialize($session["session_data"]);
        }

        return null;
    }

    public function deleteSession(string $sessionId): void
    {
        $this->connection->executeStatement(
            "DELETE FROM sessions WHERE session_id = ?",
            [$sessionId]
        );
    }

    public function cleanupExpiredSessions(): void
    {
        $this->connection->executeStatement(
            "DELETE FROM sessions WHERE session_lifetime <= ?",
            [time()]
        );
    }
}
