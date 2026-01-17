<?php

namespace App\Class\Model;

class GroupModel extends AbstractModel
{
    protected function getBaseTable(): string
    {
        return "`groups`";
    }

    protected function getEntityColumns(): array
    {
        return [
            "id",
            "name"
        ];
    }
}
