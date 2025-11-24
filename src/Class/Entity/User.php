<?php

namespace App\Class\Entity;

use App\Class\Core\DB\Connection;
use Doctrine\DBAL\Exception;
use Random\RandomException;

readonly final class User
{
    public function __construct(
        private Connection $connection
    )
    {
    }

    /**
     * @param string $login    New user login
     * @param string $password New user password
     * @param array $extra     Other fields of the table "users"
     *
     * @return int Created user ID
     *
     * @throws Exception
     * @throws RandomException
     */
    public function add(string $login, string $password, array $extra = []): int
    {
        $this->connection->insert(
            "users",
            [
                "login"      => $login,
                "first_name" => $extra["first_name"],
                "last_name"  => $extra["last_name"],
                "password"   => $password,
                "disabled"   => 0,
                "roles"      => "[\"ROLE_USER\"]", // TODO: add the permissions system
                "created_at" => $this->connection->now(),
                "force_to_change_password" => 1,
            ]
        );

        return $this->connection->getLastInsertId();
    }

    /**
     * @param int $userId
     *
     * @return void
     *
     * @throws Exception
     */
    public function disable(int $userId): void
    {
        $this->connection->update(
            "users",
            ["disabled" => 1],
            "id = ?",
            [$userId]
        );
    }
}
