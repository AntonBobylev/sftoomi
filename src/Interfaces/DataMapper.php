<?php

namespace App\Interfaces;

interface DataMapper
{
    public function dataToEntity(array $data, $entity);
    public function entityToData($entity): array;
}
