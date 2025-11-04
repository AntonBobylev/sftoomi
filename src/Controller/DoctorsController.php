<?php

namespace App\Controller;

use App\Class\EntityManipulator;
use App\Class\Fetcher;
use App\Class\Model\DoctorModel;
use App\Class\Model\FacilityModel;
use Doctrine\DBAL\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class DoctorsController extends SftoomiController
{
    #[Route("/getDoctors", name: "get_doctors")]
    public function getDoctors(Request $request): Response
    {
        $doctorModel = new DoctorModel($this->connection);

        $result = $doctorModel->getAll(
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
    #[Route("/getDoctor", name: "get_doctor")]
    public function getDoctor(Request $request): Response
    {
        $data = [];
        $doctorId = Fetcher::int($request->request->get("id"));

        if (!empty($doctorId)) {
            $doctorModel = new DoctorModel($this->connection);
            $data = $doctorModel->get($doctorId);

            $sql = "select fd.facility_id as id, f.short_name, f.full_name
                    from facilities_doctors fd
                        left join facility f on f.id = fd.facility_id 
                    where fd.doctor_id = ?";
            $data["doctor_facilities"] = $this->connection->fetchAll($sql, [$doctorId]);
        }

        return new JsonResponse([
            "data"  => $data,
            "lists" => [
                "facilities" => new FacilityModel($this->connection)->getAll()["data"]
            ]
        ]);
    }

    /**
     * @throws Exception
     */
    #[Route("/saveDoctor", name: "save_doctor")]
    public function saveDoctor(Request $request): Response
    {
        $values = [
            "id"          => Fetcher::int($request->request->get("id")),
            "last_name"   => Fetcher::trim($request->request->get("last_name")),
            "first_name"  => Fetcher::trim($request->request->get("first_name")),
            "middle_name" => Fetcher::trim($request->request->get("middle_name"))
        ];

        $this->assertAllRequiredFieldsSet(["last_name", "first_name"], $values);

        if (!empty($values["last_name"])) {
            $values["last_name"] = mb_strtoupper($values["last_name"]);
        }

        if (!empty($values["first_name"])) {
            $values["first_name"] = mb_strtoupper($values["first_name"]);
        }

        if (!empty($values["middle_name"])) {
            $values["middle_name"] = mb_strtoupper($values["middle_name"]);
        }

        $this->connection->insupd(
            "doctor",
            $values,
            "id = ?",
            [$values["id"]]
        );

        $doctorId = $values["id"];
        if (empty($doctorId)) {
            $doctorId = $this->connection->getLastInsertId();
        }

        $doctorFacilitiesIds = Fetcher::intArray($request->request->get("doctor_facilities_ids"));

        if (empty($doctorFacilitiesIds)) {
            throw new \RuntimeException("Doctor must be assigned at least to one facility");
        }

        $this->connection->delete(
            "facilities_doctors",
            "doctor_id = ?",
            [$doctorId]
        );

        foreach ($doctorFacilitiesIds as $facilityId) {
            $this->connection->insert(
                "facilities_doctors",
                [
                    "doctor_id"   => $doctorId,
                    "facility_id" => $facilityId
                ]
            );
        }

        return new JsonResponse([
            "id" => $doctorId
        ]);
    }

    #[Route("/removeDoctor", name: "remove_doctor")]
    public function removeDoctor(Request $request): Response
    {
        $ids = Fetcher::intArray($request->request->get("ids"));

        new EntityManipulator($this->connection)
            ->remove("doctor", $ids);

        return new JsonResponse([]);
    }
}
