<?php

namespace App\Class\Model;

class UserModel extends AbstractModel
{
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
