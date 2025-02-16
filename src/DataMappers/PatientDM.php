<?php

namespace App\DataMappers;

use App\Entity\Patient;
use App\Interfaces\DataMapper;

final class PatientDM implements DataMapper
{
    private array $entityColumn = [
        "last_name",
        "first_name",
        "middle_name",
        "dob"
    ];

    /**
     * @param array   $data
     * @param Patient $entity
     *
     * @return Patient
     */
    public function dataToEntity(array $data, $entity): Patient
    {
        if (empty($data)) {
            return $entity;
        }

        foreach ($this->entityColumn as $column) {
            $entity = $this->addEntityValue($entity, $data, $column);
        }

        return $entity;
    }

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
            "first_name" => $entity->getFirstName()
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
     * @param Patient $patient
     * @param array   $data
     * @param string  $column
     *
     * @return Patient
     */
    protected function addEntityValue($patient, array $data, string $column): Patient
    {
        if ($this->columnHasValue($data, $column)) {
            $this->applyValueByColumn($patient, $column, $data[$column]);

            return $patient;
        }

        $this->applyValueByColumn($patient, $column, null);

        return $patient;
    }

    /**
     * @param array  $data
     * @param string $column
     *
     * @return bool
     */
    private function columnHasValue(array $data, string $column): bool
    {
        return isset($data[$column]) && $data[$column] !== "null";
    }

    private function applyValueByColumn(Patient $patient, string $column, mixed $value): Patient
    {
        switch ($column) {
            case "last_name":
                $patient->setLastName($value);
                break;
            case "first_name":
                $patient->setFirstName($value);
                break;
            case "middle_name":
                $patient->setMiddleName($value);
                break;
            case "dob":
                $patient->setDob($value);
                break;
        }

        return $patient;
    }
}
