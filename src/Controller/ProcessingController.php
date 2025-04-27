<?php

namespace App\Controller;

use App\Class\Fetcher;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ProcessingController extends AppCrudController
{
    protected string $baseTable = "examination";

    #[Route("/getExamination", name: "get_examination")]
    public function getExamination(Request $request): Response
    {
        $data = [];

        $examinationId = Fetcher::int($request->request->get("examination_id"));
        if (isset($examinationId)) {
            $request->request->set("id", $examinationId);
            $request->request->remove("examination_id");

            $data = $this->getOne(
                $request,
                ["id", "patient_id", "facility_id", "doctor_id"]
            );

            $sql = "select study_id
                    from examinations_studies
                    where examination_id = $examinationId";
            $data["studies"] = $this->connection->fetchAllNumeric($sql);
        }

        $sql = "select f.id, f.short_name, f.full_name,
                    group_concat(fd.doctor_id separator ',') as doctors
                from facility f
                    left join facilities_doctors fd on fd.facility_id = f.id
                group by f.id";
        $facilities = $this->connection->fetchAllAssociative($sql);

        $sql = "select d.id, d.last_name, d.first_name, d.middle_name,
                    group_concat(fd.facility_id separator ',') as facilities
                from doctor d
                    left join facilities_doctors fd on fd.doctor_id = d.id
                group by d.id";
        $doctors = $this->connection->fetchAllAssociative($sql);

        $sql = "select id, full_name, short_name
                from study";
        $studies = $this->connection->fetchAllAssociative($sql);

        return new JsonResponse([
            "data"  => $data,
            "lists" => [
                "facilities" => $facilities,
                "doctors"    => $doctors,
                "studies"    => $studies
            ]
        ]);
    }
    #[Route("/saveExamination", name: "save_examination")]
    public function saveExamination(Request $request)
    {
        $values = [
            "id"          => Fetcher::int($request->request->get("examination_id")),
            "facility_id" => Fetcher::int($request->request->get("facility_id")),
            "doctor_id"   => Fetcher::int($request->request->get("doctor_id"))
        ];

        $this->connection->beginTransaction();

        $patientId = Fetcher::int($request->request->get("patient_id"));
        if (!isset($patientId)) {
            $patient = [
                "last_name"   => Fetcher::trim($request->request->get("patient_last_name")),
                "first_name"  => Fetcher::trim($request->request->get("patient_first_name")),
                "middle_name" => Fetcher::trim($request->request->get("patient_middle_name")),
                "dob"         => Fetcher::date($request->request->get("patient_dob")),
                "phone"       => Fetcher::trim($request->request->get("patient_phone"))
            ];

            if (empty($patient["last_name"]) || empty($patient["first_name"])) {
                throw new \RuntimeException("You must specify patient last name and first name");
            }

            try {
                $this->connection->insert(
                    "patient",
                    $patient
                );
            } catch (\Exception $exception) {
                $this->connection->rollBack();
                throw new \RuntimeException(sprintf("There was a problem on patient saving process: %s", $exception->getMessage()));
            }

            $patientId = $this->connection->lastInsertId();
        }

        $values["patient_id"] = $patientId;

        try {
            $id = $this->save($request, $values)["id"];

            $studyIds = Fetcher::intArray($request->request->get("study_ids"));

            if (empty($studyIds)) {
                throw new \RuntimeException("You must specify at least one study to save the examination");
            }

            $this->connection->delete("examinations_studies", ["examination_id" => $id]);
            foreach ($studyIds as $studyId) {
                $this->connection->insert(
                    "examinations_studies",
                    [
                        "examination_id" => $id,
                        "study_id"       => $studyId
                    ]
                );
            }
        } catch (\Exception $e) {
            $this->connection->rollback();

            throw new \RuntimeException("Failed to save the examination due to error: " . $e->getMessage());
        }

        $this->connection->commit();

        return new JsonResponse([
             "id" => $id
        ]);
    }
}
