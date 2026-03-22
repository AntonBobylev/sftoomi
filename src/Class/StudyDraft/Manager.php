<?php

namespace App\Class\StudyDraft;

use App\Class\Core\DB\Connection;
use App\Class\Format;

class Manager
{
    public function __construct(private Connection $connection)
    {
    }

    public function getStudyDraftData(int $examId): array
    {
        $sql = "select study.short_name as study_short_name,
                    p.last_name as patient_last_name, p.first_name as patient_first_name, p.middle_name as patient_middle_name,
                    d.last_name as doctor_last_name, d.first_name as doctor_first_name, d.middle_name as doctor_middle_name,
                    es.exam_id, es.examination_id
                from examinations_studies es
                    left join examinations e on e.id = es.examination_id
                    left join study on study.id = es.study_id
                    left join patient p on p.id = e.patient_id
                    left join doctor d on d.id = e.doctor_id
                where es.exam_id = ?";
        $data = $this->connection->fetchRow($sql, [$examId]);
        if (empty($data)) {
            return [];
        }

        $draft = new DTO(
            patient_name:     Format::humanShortName($data["patient_last_name"], $data["patient_first_name"], $data["patient_middle_name"]),
            examination_id:   $data["examination_id"],
            exam_id:          $data["exam_id"],
            study_short_name: $data["study_short_name"],
            doctor_name:      Format::humanShortName($data["doctor_last_name"], $data["doctor_first_name"], $data["doctor_middle_name"])
        );

        return $draft->toArray();
    }
}
