<?php

/** @noinspection PhpMultipleClassDeclarationsInspection */

namespace App\Repository;

use App\Entity\Examination;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ExaminationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Examination::class);
    }
}
