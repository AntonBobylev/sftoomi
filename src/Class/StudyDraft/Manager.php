<?php

namespace App\Class\StudyDraft;

use App\Class\Core\DB\Connection;
use App\Class\Format;
use DateTimeImmutable;

readonly class Manager
{
    public function __construct(private Connection $connection)
    {
    }

    public function getStudyDraftData(int $examId): array
    {
        $sql = "select study.full_name as study_full_name,
                    p.last_name as patient_last_name, p.first_name as patient_first_name, p.middle_name as patient_middle_name,
                    p.dob as patient_dob,
                    d.last_name as doctor_last_name, d.first_name as doctor_first_name, d.middle_name as doctor_middle_name,
                    es.exam_id, e.date as examination_date, es.examination_id,
                    f.full_name
                from examinations_studies es
                    left join examinations e on e.id = es.examination_id
                    left join study on study.id = es.study_id
                    left join patient p on p.id = e.patient_id
                    left join doctor d on d.id = e.doctor_id
                    left join facility f on f.id = e.facility_id
                where es.exam_id = ?";
        $data = $this->connection->fetchRow($sql, [$examId]);
        if (empty($data)) {
            return [];
        }

        // TODO: move to format class
        $dob = new DateTimeImmutable($data["patient_dob"]);
        $today = new DateTimeImmutable();
        $data["patient_age"] = $today->diff($dob)->y; // TODO: calculate

        $data["patient_gender"] = "M"; // TODO: add to entity

        $draft = new DTO(
            patient_name:       Format::humanShortName($data["patient_last_name"], $data["patient_first_name"], $data["patient_middle_name"]),
            patient_dob:        DateTimeImmutable::createFromFormat("Y-m-d", $data["patient_dob"])->format("m/d/Y"), // TODO: move to format class
            patient_age:        $data["patient_age"],
            patient_gender:     $data["patient_gender"],
            exam_id:            $data["exam_id"],
            examination_date:   $data["examination_date"],
            study_full_name:    $data["study_full_name"],
            doctor_full_name:   Format::humanShortName($data["doctor_last_name"], $data["doctor_first_name"], $data["doctor_middle_name"]),
            facility_full_name: $data["full_name"]
        );

        return $draft->toArray();
    }
}
