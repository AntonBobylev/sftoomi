<?php

namespace App\Interfaces;

interface DataMapper
{
    public function dataToEntity(array $data);
    public function entityToData($entity): array;
}
