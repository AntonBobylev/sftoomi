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

        $sql = "select f.id, f.short_name, f.full_name,
                    group_concat(fd.doctor_id separator ',') as doctors
                from facility f
                    left join facilities_doctors fd on fd.facility_id = f.id
                group by f.id";
        $facilities = $connection->fetchAllAssociative($sql);

        $sql = "select d.id, d.last_name, d.first_name, d.middle_name,
                    group_concat(fd.facility_id separator ',') as facilities
                from doctor d
                    left join facilities_doctors fd on fd.doctor_id = d.id
                group by d.id";
        $doctors = $connection->fetchAllAssociative($sql);

        $sql = "select id, full_name, short_name
                from study";
        $studies = $connection->fetchAllAssociative($sql);

        return new JsonResponse([
            "data"  => [],
            "lists" => [
                "facilities" => $facilities,
                "doctors"    => $doctors,
                "studies"    => $studies
            ]
        ]);
    }
}
