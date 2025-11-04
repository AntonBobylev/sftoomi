<?php

namespace App\Class\Model;

class PatientModel extends AbstractModel
{
    protected function getBaseTable(): string
    {
        return "patient";
    }

    protected function getEntityColumns(): array
    {
        return [
            "id",
            "last_name",
            "first_name",
            "middle_name",
            "dob",
            "phone"
        ];
    }
}
