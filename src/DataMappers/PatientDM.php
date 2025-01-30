<?php

namespace App\DataMappers;

use App\Entity\Patient;
use App\Interfaces\DataMapper;

final class PatientDM implements DataMapper
{
    /**
     * @param array $data
     *
     * @return Patient
     */
    public function dataToEntity(array $data): Patient
    {
        $patient = new Patient();

        if (empty($data)) {
            return $patient;
        }

        if (isset($data["last_name"])) {
            $patient->setLastName($data["last_name"]);
        }

        if (isset($data["first_name"])) {
            $patient->setFirstName($data["first_name"]);
        }

        if (isset($data["middle_name"])) {
            $patient->setMiddleName($data["middle_name"]);
        }

        if (isset($data["dob"])) {
            $patient->setDob($data["dob"]);
        }

        return $patient;
    }

    /**
     * @param Patient $entity
     *
     * @return array
     */
    public function entityToData($entity): array
    {
        return [
            "id"          => $entity->getId(),
            "last_name"   => $entity->getLastName(),
            "first_name"  => $entity->getFirstName(),
            "middle_name" => $entity->getMiddleName(),
            "dob"         => $entity->getDob()
        ];
    }
}
