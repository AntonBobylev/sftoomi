<?php

namespace App\Controller;

use App\Class\Fetcher;
use App\Class\Model\DoctorModel;
use App\Class\Model\FacilityModel;
use Doctrine\DBAL\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class FacilitiesController extends SftoomiController
{
    /**
     * @throws Exception
     */
    #[Route("/getFacilities", name: "get_facilities")]
    public function getFacilities(Request $request): Response
    {
        $facilityModel = new FacilityModel($this->connection);
        $result = $facilityModel->getAll(
            $request->request->get("start"),
            $request->request->get("limit")
        );

        return new JsonResponse([
            "data"  => $result["data"],
            "total" => $result["total"]
        ]);
    }

    /**
     * @throws Exception
     */
    #[Route("/getFacility", name: "get_facility")]
    public function getFacility(Request $request): Response
    {
        $data = [];
        $facilityId = Fetcher::int($request->request->get("id"));
        if (!empty($facilityId)) {
            $facilityModel = new FacilityModel($this->connection);
            $data = $facilityModel->get($facilityId);

            $sql = "select fd.doctor_id as id, d.last_name, d.first_name, d.middle_name
                    from facilities_doctors fd
                        left join doctor d on d.id = fd.doctor_id 
                    where fd.facility_id = ?";
            $data["facility_doctors"] = $this->connection->fetchAll($sql, [$facilityId]);
        }

        return new JsonResponse([
            "data"  => $data,
            "lists" => [
                "doctors" => new DoctorModel($this->connection)->getAll()["data"]
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

        try {
            $this->connection->beginTransaction();

            $data = $this->save(
                $request,
                $values,
                [
                    "short_name",
                    "full_name"
                ]
            );

            $facilityDoctorIds = Fetcher::intArray($request->request->get("facility_doctor_ids"), []);

            $this->connection->delete("facilities_doctors", ["facility_id" => $data["id"]]);
            foreach ($facilityDoctorIds as $doctorId) {
                $this->connection->insert(
                    "facilities_doctors",
                    [
                        "doctor_id"   => $doctorId,
                        "facility_id" => $data["id"]
                    ]
                );
            }
        } catch (\Exception $e) {
            throw new \RuntimeException("Failed to save facility due to error: " . $e->getMessage());
        }

        $this->connection->commit();

        return new JsonResponse([
            "id" => $data["id"]
        ]);
    }

    #[Route("/removeFacility", name: "remove_facility")]
    public function removeFacility(Request $request): Response
    {
        $this->remove($request);

        return new JsonResponse([]);
    }
}
