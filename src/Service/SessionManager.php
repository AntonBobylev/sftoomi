<?php

namespace App\Service;

use App\Class\Core\DB\Connection;

final readonly class SessionManager
{
    public function __construct(private Connection $connection)
    {
    }

    public function createSession(array $user): string
    {
        $sessionId = bin2hex(random_bytes(64));
        $lifetime = time() + 3600;

        $values = [
            "session_id"   => $sessionId,
            "session_data" => serialize([
                "id"    => $user["id"],
                "login" => $user["login"]
            ]),
            "session_lifetime" => $lifetime,
            "session_time"     => time()
        ];

        $this->connection->insert(
            "sessions",
            $values
        );

        $this->cleanupExpiredSessions();

        return $sessionId;
    }

    public function validateSession(string $sessionId): ?array
    {
        if (rand(1, 100) === 1) {
            $this->cleanupExpiredSessions();
        }

        $sql = "select session_data
                from sessions
                where session_id = ? and session_lifetime > ?";
        $session = $this->connection->selString($sql, [$sessionId, time()]);

        if (!empty($session)) {
            $this->connection->update(
                "sessions",
                [ "session_lifetime" => time() + 3600 ],
                "session_id = ?",
                [$sessionId]
            );

            return unserialize($session);
        }

        return null;
    }

    public function deleteSession(string $sessionId): void
    {
        $this->connection->delete(
            "sessions",
            "session_id = ?",
            [$sessionId]
        );
    }

    public function cleanupExpiredSessions(): void
    {
        $this->connection->delete(
            "sessions",
            "session_lifetime <= ?",
            [time()]
        );
    }
}
