<?php

namespace App\Class\Model;

class UserModel extends AbstractModel
{
    public function get(?int $id, ?string $filters = null): array
    {
        $user = parent::get($id, $filters);

        if (isset($user["id"])) {
            $sql = "select group_id
                    from users_groups
                    where user_id = ?";
            $groupIds = $this->connection->fetchCol($sql, [$user["id"]]);

            $sql = "select p.name
                    from groups_permissions gp
                        left join permissions p on p.id = gp.permission_id
                    where gp.group_id in ?";
            $user["permissions"] = $this->connection->fetchCol($sql, [$groupIds]);
        }

        return $user;
    }

    protected function getBaseTable(): string
    {
        return "users";
    }

    protected function getEntityColumns(): array
    {
        return [
            "id",
            "disabled",
            "login",
            "force_to_change_password",
            "first_name",
            "last_name",
            "created_at",
            "contact_id"
        ];
    }
}
