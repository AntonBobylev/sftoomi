<?php

namespace App\Controller;

use Doctrine\DBAL\Exception;
use Doctrine\ORM\EntityManagerInterface;
use RuntimeException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class FacilitiesController extends AbstractController
{
    /**
     * @throws Exception
     */
    #[Route('/getFacilities', name: 'get_facilities')]
    public function getFacilities(EntityManagerInterface $entityManager, Request $request): Response
    {
        $limit = $request->request->get("limit");
        $start = $request->request->get("start");
        $start = $limit * $start;

        $connection = $entityManager->getConnection();
        $facilities = $connection->createQueryBuilder()
            ->select(["id", "short_name", "full_name"])
            ->from("facility")
            ->setFirstResult($start)
            ->setMaxResults($limit)
            ->fetchAllAssociative();

        $sql = "select count(*) from facility";
        $total = $connection->fetchOne($sql);

        return new JsonResponse([
            "data"  => $facilities,
            "total" => $total
        ]);
    }

    #[Route('/getFacility', name: 'get_facility')]
    public function getFacility(EntityManagerInterface $entityManager, Request $request): Response
    {
        $id = $request->request->get("id");

        $sql = "select id, short_name, full_name
                from facility
                where id = $id";
        $facility = $entityManager->getConnection()->fetchAssociative($sql);

        if (empty($facility)) {
            throw new RuntimeException("Facility not found");
        }

        return new JsonResponse([
            "data" => $facility
        ]);
    }
}
