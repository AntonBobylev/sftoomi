<?php

namespace App\Controller;

use App\Class\EntityManipulator;
use App\Class\Fetcher;
use App\Class\Format;
use App\Class\Model\PatientModel;
use Doctrine\DBAL\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class PatientsController extends SftoomiController
{
    /**
     * @throws Exception
     */
    #[Route("/getPatients", name: "get_patients")]
    public function getPatients(Request $request): Response
    {
        $patientModel = new PatientModel($this->connection);
        $result = $patientModel->getAll(
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
    #[Route("/getPatient", name: "get_patient")]
    public function getPatient(Request $request): Response
    {
        $id = Fetcher::int($request->request->get("id"));
        $data = [];

        if (isset($id)) {
            $patientModel = new PatientModel($this->connection);
            $data = $patientModel->get($id);
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
            "patient",
            $values,
            "id = ?",
            [$values["id"]]
        );

        $patientId = $values["id"];
        if (empty($patientId)) {
            $patientId = $this->connection->getLastInsertId();
        }

        return new JsonResponse([
            "id" => $patientId
        ]);
    }

    #[Route("/removePatient", name: "remove_patient")]
    public function removePatient(Request $request): Response
    {
        $ids = Fetcher::intArray($request->request->get("ids"));

        new EntityManipulator($this->connection)
            ->remove("patient", $ids);

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

        $excludeIds = Fetcher::intArray($request->request->get("exclude_ids"));

        return new JsonResponse([
            "data" => $this->tryLookupPatient($query, $excludeIds)
        ]);
    }

    /**
     * @throws Exception
     */
    private function tryLookupPatient(string $query, array $excludeIds): array
    {
        $filters = [];
        if (!empty($excludeIds)) {
            $filters[] = $this->connection->subst("id not in ?", [$excludeIds]);
        }

        $filters = empty($filters) ? "true" : implode(" and ", $filters);
        $sql = "select id, last_name, first_name, middle_name, dob, phone
                from patient
                where (
                        id = :query or
                        last_name like '%$query%' or
                        first_name like '%$query%' or
                        middle_name like '%$query%'
                    )
                    and $filters";
        $patients = $this->connection->fetchAll($sql, ["query" => $query]);

        foreach ($patients as &$patient) {
            $data = [
                "value"   => $patient["id"],
                "caption" => sprintf(
                    "%s (#%s)",
                    Format::humanShortName($patient),
                    $patient["id"]
                )
            ];

            $patient = $data;
        }
        unset($patient);

        return $patients;
    }
}
