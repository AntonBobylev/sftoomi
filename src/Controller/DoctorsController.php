<?php

namespace App\Controller;

use App\Class\Fetcher;
use App\Class\Model\DoctorModel;
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
        $sql = "select id, full_name, short_name
                from facility";
        $facilities = $this->connection->fetchAllAssociative($sql);

        $data = [];
        $doctorId = $request->request->get("id");
        if (!empty($doctorId)) {
            $data = $this->getOne($request, ["id", "last_name", "first_name", "middle_name"]);

            $sql = "select fd.facility_id as id, f.short_name, f.full_name
                    from facilities_doctors fd
                        left join facility f on f.id = fd.facility_id 
                    where fd.doctor_id = $doctorId";
            $data["doctor_facilities"] = $this->connection->fetchAllAssociative($sql);
        }

        return new JsonResponse([
            "data"  => $data,
            "lists" => [
                "facilities" => $facilities
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

        if (!empty($values["last_name"])) {
            $values["last_name"] = mb_strtoupper($values["last_name"]);
        }

        if (!empty($values["first_name"])) {
            $values["first_name"] = mb_strtoupper($values["first_name"]);
        }

        if (!empty($values["middle_name"])) {
            $values["middle_name"] = mb_strtoupper($values["middle_name"]);
        }

        try {
            $this->connection->beginTransaction();

            $result = $this->save(
                $request,
                $values,
                [
                    "last_name",
                    "first_name"
                ]
            );

            $doctorFacilitiesIds = Fetcher::intArray($request->request->get("doctor_facilities_ids"));

            if (empty($doctorFacilitiesIds)) {
                throw new \RuntimeException("Doctor must be assigned at least to one facility");
            }

            $this->connection->delete("facilities_doctors", ["doctor_id" => $result["id"]]);
            foreach ($doctorFacilitiesIds as $facilityId) {
                $this->connection->insert(
                    "facilities_doctors",
                    [
                        "doctor_id"   => $result["id"],
                        "facility_id" => $facilityId
                    ]
                );
            }
        } catch (\Exception $e) {
            $this->connection->rollback();

            throw new \RuntimeException("Failed to save doctor due to error: " . $e->getMessage());
        }

        $this->connection->commit();

        return new JsonResponse([
            "id" => $result["id"]
        ]);
    }

    #[Route("/removeDoctor", name: "remove_doctor")]
    public function removeDoctor(Request $request): Response
    {
        $this->remove($request);

        return new JsonResponse([]);
    }
}
