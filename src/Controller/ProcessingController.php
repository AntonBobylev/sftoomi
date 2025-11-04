<?php

namespace App\Controller;

use App\Class\Fetcher;
use App\Class\Model\ExaminationModel;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ProcessingController extends SftoomiController
{
    #[Route("/getExaminations", name: "get_examinations")]
    public function getExaminations(Request $request): Response
    {
        $filters = [];

        $examinationDate = Fetcher::date($request->request->get("examination_date"));
        if (!empty($examinationDate)) {
            $filters[] = $this->connection->subst("date = ?", [$examinationDate]);
        }

        $examinationId = Fetcher::int($request->request->get("examination_id"));
        if (!empty($examinationId)) {
            $filters[] = $this->connection->subst("id = ?", [$examinationId]);
        }

        $filters = empty($filters) ? "true" : implode(" and ", $filters);

        $examinationModel = new ExaminationModel($this->connection);
        $result = $examinationModel->getAll(
            $request->request->get("start"),
            $request->request->get("limit"),
            $filters
        );

        return new JsonResponse([
            "data"  => $result["data"],
            "total" => $result["total"]
        ]);
    }

    #[Route("/getExaminationsFilters", name: "get_examinations_filters")]
    public function getExaminationsFilters(): Response
    {
        $sql = "select distinct date
                from examination";
        $data["dates_with_examinations"] = $this->connection->fetchCol($sql);

        return new JsonResponse([
            "data" => $data
        ]);
    }

    #[Route("/getExamination", name: "get_examination")]
    public function getExamination(Request $request): Response
    {
        $data = [];

        $examinationId = Fetcher::int($request->request->get("examination_id"));
        $request->request->set("id", $examinationId);

        if (isset($examinationId)) {
            $data = $this->getOne(
                $request,
                ["id", "patient_id", "facility_id", "doctor_id", "date"]
            );

            $sql = "select study_id
                    from examinations_studies
                    where examination_id = $examinationId";
            $data["studies"] = $this->connection->fetchFirstColumn($sql);

            $sql = "select p.id, last_name, first_name, middle_name, dob, phone
                    from examination ex
                        left join patient p on p.id = ex.patient_id
                    where ex.id = $examinationId";
            $data["patient"] = $this->connection->fetchAssociative($sql);
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
    public function saveExamination(Request $request): JsonResponse
    {
        $values = [
            "id"          => Fetcher::int($request->request->get("examination_id")),
            "date"        => Fetcher::date($request->request->get("examination_date")),
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
        $request->request->set("id", $values["id"]);

        try {
            $id = $this->save($request, $values)["id"];

            $newStudyIds = Fetcher::intArray($request->request->get("study_ids"));

            if (empty($newStudyIds)) {
                throw new \RuntimeException("You must specify at least one study to save the examination");
            }

            $sql = "select exam_id, study_id
                    from examinations_studies
                    where examination_id = $id";
            $currentExaminationStudies = $this->connection->fetchAllAssociative($sql);

            $examIdsToRemove = [];
            foreach ($currentExaminationStudies as $row) {
                if (!in_array($row["study_id"], $newStudyIds)) {
                    $examIdsToRemove[] = $row["exam_id"];
                }
            }

            foreach ($examIdsToRemove as $examId) {
                $this->connection->delete("examinations_studies", ["exam_id" => $examId]);
            }

            $newStudyIdsToAdd = array_diff($newStudyIds, array_column($currentExaminationStudies, "study_id"));
            foreach ($newStudyIdsToAdd as $studyId) {
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

    #[Route("/removeExamination", name: "remove_examination")]
    public function removeExamination(Request $request): JsonResponse
    {
        $this->remove($request);

        return new JsonResponse();
    }
}
