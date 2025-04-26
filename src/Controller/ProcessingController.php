<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ProcessingController extends AbstractController
{
    #[Route("/getExamination", name: "get_examination")]
    public function getExamination(EntityManagerInterface $entityManager, Request $request): Response
    {
        $connection = $entityManager->getConnection();

        $sql = "select id, short_name, full_name
                from facility";
        $facilities = $connection->fetchAllAssociative($sql);

        $sql = "select id, last_name, first_name, middle_name
                from doctor";
        $doctors = $connection->fetchAllAssociative($sql);

        $lists = [
            "facilities" => $facilities,
            "doctors"    => $doctors
        ];

        return new JsonResponse([
            "data"  => [],
            "lists" => $lists,
        ]);
    }
}
