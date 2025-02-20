<?php

namespace App\DataMappers;

use App\Entity\Patient;

final class PatientDM extends AbstractDM
{
    protected array $entityColumns = [
        "last_name",
        "first_name",
        "middle_name",
        "dob"
    ];

    /**
     * @param Patient $entity
     *
     * @return array
     */
    public function entityToData($entity): array
    {
        $data = [
            "id"         => $entity->getId(),
            "last_name"  => $entity->getLastName(),
            "first_name" => $entity->getFirstName(),
            "phone"      => $entity->getPhone()
        ];

        $middleName = $entity->getMiddleName();
        if (isset($middleName)) {
            $data["middle_name"] = $middleName;
        }

        $dob = $entity->getDob();
        if (isset($dob)) {
            $data["dob"] = $dob;
        }

        return $data;
    }

    /**
     * @param Patient $entity
     * @param string  $column
     * @param mixed   $value
     * @return Patient
     */
    protected function applyValueByColumn(mixed $entity, string $column, mixed $value): Patient
    {
        switch ($column) {
            case "last_name":
                $entity->setLastName($value);
                break;
            case "first_name":
                $entity->setFirstName($value);
                break;
            case "middle_name":
                $entity->setMiddleName($value);
                break;
            case "dob":
                $entity->setDob($value);
                break;
            case "phone":
                $entity->setPhone($value);
                break;
        }

        return $entity;
    }
}
