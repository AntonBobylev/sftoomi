<?php

namespace App\DataMappers;

use App\Interfaces\DataMapper;

abstract class AbstractDM implements DataMapper
{
    protected array $entityColumns;

    /**
     * @param mixed $entity
     *
     * @return array
     */
    public abstract function entityToData($entity): array;

    /**
     * @param mixed  $entity
     * @param string $column
     * @param mixed  $value
     *
     * @return mixed
     */
    protected abstract function applyValueByColumn(mixed $entity, string $column, mixed $value): mixed;

    /**
     * @param array $data
     * @param mixed $entity
     *
     * @return mixed
     */
    public function dataToEntity(array $data, $entity): mixed
    {
        if (empty($data)) {
            return $entity;
        }

        foreach ($this->entityColumns as $column) {
            $entity = $this->addEntityValue($entity, $data, $column);
        }

        return $entity;
    }

    /**
     * @param mixed  $entity
     * @param array  $data
     * @param string $column
     *
     * @return mixed
     */
    protected function addEntityValue(mixed $entity, array $data, string $column): mixed
    {
        if ($this->columnHasValue($data, $column)) {
            $this->applyValueByColumn($entity, $column, $data[$column]);

            return $entity;
        }

        $this->applyValueByColumn($entity, $column, null);

        return $entity;
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
}
