<?php

namespace App\Class\Model;

class CptModel extends AbstractModel
{
    protected function getBaseTable(): string
    {
        return "cpts";
    }

    protected function getEntityColumns(): array
    {
        return [
            "id",
            "code",
            "short_name",
            "full_name"
        ];
    }
}
