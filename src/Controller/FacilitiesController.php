<?php

namespace App\Controller;

use App\Class\Fetcher;
use App\Repository\FacilityRepository;
use Doctrine\DBAL\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class FacilitiesController extends AppCrudController
{
    protected string $baseTable = "facility";

    /**
     * @throws Exception
     */
    #[Route("/getFacilities", name: "get_facilities")]
    public function getFacilities(Request $request): Response
    {
        $facilities = $this->getList(
            $request,
            ["id", "short_name", "full_name"]
        );

        $data = $facilities["data"];
        foreach ($data as &$row) {
            $sql = "select d.id, d.last_name, d.first_name, d.middle_name
                    from facilities_doctors fd
                        left join doctor d on d.id = fd.doctor_id
                    where fd.facility_id = {$row["id"]}";
            $row["facility_doctors"] = $this->entityManager->getConnection()->fetchAllAssociative($sql);
        }
        unset($row);

        return new JsonResponse([
            "data"  => $data,
            "total" => $facilities["total"]
        ]);
    }

    /**
     * @throws Exception
     */
    #[Route("/getFacility", name: "get_facility")]
    public function getFacility(Request $request): Response
    {
        $sql = "select id, last_name, first_name, middle_name
                from doctor";
        $doctors = $this->entityManager->getConnection()->fetchAllAssociative($sql);

        $data = [];
        $facilityId = $request->request->get("id");
        if (!empty($facilityId)) {
            $data = $this->getOne($request, ["id", "short_name", "full_name"]);

            $sql = "select fd.doctor_id as id, d.last_name, d.first_name, d.middle_name
                    from facilities_doctors fd
                        left join doctor d on d.id = fd.doctor_id 
                    where fd.facility_id = $facilityId";
            $data["facility_doctors"] = $this->entityManager->getConnection()->fetchAllAssociative($sql);
        }

        return new JsonResponse([
            "data"  => $data,
            "lists" => [
                "doctors" => $doctors
            ]
        ]);
    }

    /**
     * @throws Exception
     */
    #[Route("/saveFacility", name: "save_facility")]
    public function saveFacility(Request $request): Response
    {
        $values = [
            "id"         => Fetcher::int($request->request->get("id")),
            "short_name" => Fetcher::trim($request->request->get("short_name")),
            "full_name"  => Fetcher::trim($request->request->get("full_name"))
        ];

        $connection = $this->entityManager->getConnection();

        $connection->beginTransaction();

        $id = $this->save($request, $values)["id"];

        $facilityDoctorIds = Fetcher::intArray($request->request->get("facility_doctor_ids"));

        $connection->delete("facilities_doctors", ["facility_id" => $id]);
        foreach ($facilityDoctorIds as $doctorId) {
            $connection->insert(
                "facilities_doctors",
                [
                    "doctor_id"   => $doctorId,
                    "facility_id" => $id
                ]
            );
        }

        $connection->commit();

        return new JsonResponse([
            "id" => $id
        ]);
    }

    #[Route("/removeFacility", name: "remove_facility")]
    public function removeFacility(FacilityRepository $facilityRepository, Request $request): Response
    {
        $this->remove($facilityRepository, $request);

        return new JsonResponse([]);
    }
}
