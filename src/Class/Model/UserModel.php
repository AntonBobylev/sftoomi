<?php

namespace App\Class\Model;

use Doctrine\DBAL\Exception;

class UserModel extends AbstractModel
{
    protected function getBaseTable(): string
    {
        return "users";
    }

    /**
     * @throws Exception
     */
    public function get(int $id): array
    {
        $sql = "select {$this->getEntityInlineColumns()}
                from {$this->getBaseTable()}
                where id = ?";

        return $this->connection->fetchRow($sql, [$id]);
    }

    protected function getEntityColumns(): array
    {
        return [
            "id",
            "disabled",
            "login",
            "roles",
            "force_to_change_password",
            "first_name",
            "last_name",
            "created_at",
            "contact_id"
        ];
    }
}
