<?php

namespace App\Class\Model;

class PermissionModel extends AbstractModel
{
    protected function getBaseTable(): string
    {
        return "permissions";
    }

    protected function getEntityColumns(): array
    {
        return [
            "id",
            "name",
            "description"
        ];
    }
}
