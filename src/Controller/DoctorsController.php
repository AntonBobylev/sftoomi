<?php

namespace App\Controller;

use App\Class\Fetcher;
use App\Repository\DoctorRepository;
use Doctrine\DBAL\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class DoctorsController extends AppCrudController
{
    protected string $baseTable = "doctor";

    /**
     * @throws Exception
     */
    #[Route("/getDoctors", name: "get_doctors")]
    public function getDoctors(Request $request): Response
    {
        $doctors = $this->getList(
            $request,
            ["id", "last_name", "first_name", "middle_name"]
        );

        return new JsonResponse([
            "data"  => $doctors["data"],
            "total" => $doctors["total"]
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
        $facilities = $this->entityManager->getConnection()->fetchAllAssociative($sql);

        $data = [];
        $doctorId = $request->request->get("id");
        if (!empty($doctorId)) {
            $data = $this->getOne($request, ["id", "last_name", "first_name", "middle_name"]);

            $sql = "select fd.facility_id as id, f.short_name, f.full_name
                    from facilities_doctors fd
                        left join facility f on f.id = fd.facility_id 
                    where fd.doctor_id = $doctorId";
            $data["doctor_facilities"] = $this->entityManager->getConnection()->fetchAllAssociative($sql);
        }

        return new JsonResponse([
            "data"       => $data,
            "lists"      => [
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

        $this->entityManager->getConnection()->beginTransaction();
        $id = $this->save($request, $values)["id"];

        $doctorFacilitiesIds = Fetcher::intArray($request->request->get("doctor_facilities_ids"));

        if (empty($doctorFacilitiesIds)) {
            $this->entityManager->getConnection()->rollback();
            throw new \RuntimeException("Doctor must be assigned at least to one facility");
        }

        $this->entityManager->getConnection()->delete("facilities_doctors", ["doctor_id" => $id]);
        foreach ($doctorFacilitiesIds as $facilityId) {
            $this->entityManager->getConnection()->insert(
                "facilities_doctors",
                [
                    "doctor_id"   => $id,
                    "facility_id" => $facilityId
                ]
            );
        }

        $this->entityManager->getConnection()->commit();

        return new JsonResponse([
            "id" => $id
        ]);
    }


    /**
     * @throws Exception
     */
    #[Route("/removeDoctor", name: "remove_doctor")]
    public function removeDoctor(DoctorRepository $doctorRepository, Request $request): Response
    {
        $ids = $request->request->get("ids");
        $ids = explode(",", $ids);

        $this->entityManager->getConnection()->beginTransaction();
        foreach ($ids as $id) {
            $this->entityManager->getConnection()->delete("facilities_doctors", ["doctor_id" => $id]);
        }

        $this->remove($doctorRepository, $request);

        $this->entityManager->getConnection()->commit();

        return new JsonResponse([]);
    }
}
