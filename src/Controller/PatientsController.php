<?php

namespace App\Controller;

use App\Class\Fetcher;
use App\Class\Format;
use App\Repository\PatientRepository;
use Doctrine\DBAL\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class PatientsController extends AppCrudController
{
    protected string $baseTable = "patient";

    /**
     * @throws Exception
     */
    #[Route("/getPatients", name: "get_patients")]
    public function getPatients(Request $request): Response
    {
        $patients = $this->getList(
            $request,
            ["id", "last_name", "first_name", "middle_name", "dob", "phone"]
        );

        return new JsonResponse([
            "data"  => $patients["data"],
            "total" => $patients["total"]
        ]);
    }

    /**
     * @throws Exception
     */
    #[Route("/getPatient", name: "get_patient")]
    public function getPatient(Request $request): Response
    {
        $data = [];
        if ($request->request->has("id")) {
            $data = $this->getOne($request, ["id", "last_name", "first_name", "middle_name", "dob", "phone"]);
        }

        return new JsonResponse([
            "data" => $data
        ]);
    }

    /**
     * @throws Exception
     */
    #[Route("/savePatient", name: "save_patient")]
    public function savePatient(Request $request): Response
    {
        $values = [
            "id"          => Fetcher::int($request->request->get("id")),
            "last_name"   => Fetcher::trim($request->request->get("last_name")),
            "first_name"  => Fetcher::trim($request->request->get("first_name")),
            "middle_name" => Fetcher::trim($request->request->get("middle_name")),
            "phone"       => Fetcher::trim($request->request->get("phone")),
            "dob"         => Fetcher::date($request->request->get("dob"))
        ];

        $id = $this->save($request, $values)["id"];

        return new JsonResponse([
            "id" => $id
        ]);

    }

    #[Route("/removePatient", name: "remove_patient")]
    public function removePatient(PatientRepository $patientRepository, Request $request): Response
    {
        $this->remove($patientRepository, $request);

        return new JsonResponse([]);
    }

    /**
     * @throws Exception
     */
    #[Route("/lookupPatient", name: "lookup_patient")]
    public function lookupPatient(Request $request): Response
    {
        $query = $request->request->get("query");
        if (empty($query)) {
            return new JsonResponse([]);
        }

        $excludeIds = $request->request->get("exclude_ids");

        return new JsonResponse([
            "data" => $this->tryLookupPatient($query, $excludeIds)
        ]);
    }

    /**
     * @throws Exception
     */
    private function tryLookupPatient(string $query, ?string $excludeIds): array
    {
        $sql = "select id, last_name, first_name, middle_name
                from patient
                where (
                    id like '%$query%' or
                    last_name like '%$query%' or
                    first_name like '%$query%' or
                    middle_name like '%$query%'
                )";

        if (!empty($excludeIds)) {
            $sql .= " and id not in ($excludeIds)";
        }

        $patients = $this->connection->fetchAllAssociative($sql);
        foreach ($patients as &$patient) {
            $patient["tooltip"] = Format::humanShortName($patient);
            $patient["name"] = $patient["id"];

            unset(
                $patient["last_name"],
                $patient["first_name"],
                $patient["middle_name"]
            );
        }
        unset($patient);

        return $patients;
    }
}
