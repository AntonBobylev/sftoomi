<?php

namespace App\Controller;

use App\Class\EntityManipulator;
use App\Class\Fetcher;
use App\Class\Model\DoctorModel;
use App\Class\Model\ExaminationModel;
use App\Class\Model\FacilityModel;
use App\Class\Model\StudyModel;
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
                from examinations";
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

        if (isset($examinationId)) {
            $examinationModel = new ExaminationModel($this->connection);
            $data = $examinationModel->get($examinationId);
        }

        $facilities = new FacilityModel($this->connection)->getAll()["data"];
        foreach ($facilities as $index => &$facility) {
            $facility["doctors"] = implode(
                ",",
                array_map(function ($doctor) {
                    return $doctor["id"];
                }, $facility["facility_doctors"])
            );

            unset($facilities[$index]["facility_doctors"]);
        }
        unset($facility);

        $doctors = new DoctorModel($this->connection)->getAll()["data"];
        foreach ($doctors as $index => &$doctor) {
            $doctor["facilities"] = implode(
                ",",
                array_map(function ($facility) {
                    return $facility["id"];
                }, $doctor["doctor_facilities"])
            );

            unset($doctors[$index]["doctor_facilities"]);
        }
        unset($doctor);

        return new JsonResponse([
            "data"  => $data,
            "lists" => [
                "facilities" => $facilities,
                "doctors"    => $doctors,
                "studies"    => new StudyModel($this->connection)->getAll()["data"]
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

            $this->connection->insert(
                "patient",
                $patient
            );

            $patientId = $this->connection->getLastInsertId();
        }

        $values["patient_id"] = $patientId;

        $this->assertAllRequiredFieldsSet(["date", "facility_id", "patient_id"], $values);

        $this->connection->insupd(
            "examinations",
            $values,
            "id = :id",
            $values
        );

        $id = $values["id"];
        if (empty($id)) {
            $id = $this->connection->getLastInsertId();
        }

        $newStudyIds = Fetcher::intArray($request->request->get("study_ids"));
        if (empty($newStudyIds)) {
            throw new \RuntimeException("You must specify at least one study to save the examination");
        }

        $sql = "select exam_id, study_id
                from examinations_studies
                where examination_id = ?";
        $currentExaminationStudies = $this->connection->fetchAll($sql, [$id]);

        $examIdsToRemove = [];
        foreach ($currentExaminationStudies as $row) {
            if (!in_array($row["study_id"], $newStudyIds)) {
                $examIdsToRemove[] = $row["exam_id"];
            }
        }

        foreach ($examIdsToRemove as $examId) {
            $this->connection->delete(
                "examinations_studies",
                "exam_id = ?",
                [$examId]
            );
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

        return new JsonResponse([
             "id" => $id
        ]);
    }

    #[Route("/removeExamination", name: "remove_examination")]
    public function removeExamination(Request $request): JsonResponse
    {
        $ids = Fetcher::intArray($request->request->get("ids"));

        new EntityManipulator($this->connection)
            ->remove("examinations", $ids);

        return new JsonResponse([]);
    }
}
