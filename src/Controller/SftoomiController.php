<?php

namespace App\Controller;

use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

abstract class SftoomiController extends AbstractController
{
    protected EntityManagerInterface $entityManager;
    protected Connection $connection;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->connection = $entityManager->getConnection();
    }
}
