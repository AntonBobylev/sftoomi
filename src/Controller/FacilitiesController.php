<?php

namespace App\Controller;

use App\Repository\FacilityRepository;
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
    #[Route("/getFacilities", name: "get_facilities")]
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

    /**
     * @throws Exception
     */
    #[Route("/getFacility", name: "get_facility")]
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

    /**
     * @throws Exception
     */
    #[Route("/saveFacility", name: "save_facility")]
    public function saveFacility(EntityManagerInterface $entityManager, Request $request): Response
    {
        $id = $request->request->get("id");
        $values = [
            "id"         => $request->request->get("id"),
            "short_name" => $request->request->get("short_name"),
            "full_name"  => $request->request->get("full_name")
        ];

        $connection = $entityManager->getConnection();
        if (isset($id)) { {
            $connection->update(
                "facility",
                $values,
                ["id" => $values["id"]]
            );
        }} else {
            $connection->insert(
                "facility",
                $values
            );

            $id = $connection->lastInsertId();
        }

        return new JsonResponse([
            "id" => $id
        ]);
    }

    #[Route("/removeFacility", name: "remove_facility")]
    public function removeFacility(EntityManagerInterface $entityManager, FacilityRepository $facilityRepository, Request $request): Response
    {
        $ids = $request->request->get("ids");

        if (empty($ids)) {
            throw new RuntimeException("At least one id is required for removal operation");
        }

        $ids = explode(",", $ids);

        $facilities = $facilityRepository->findBy(["id" => $ids]);
        foreach ($facilities as $facility) {
            $entityManager->remove($facility);
        }

        $entityManager->flush();

        return new Response();
    }
}
