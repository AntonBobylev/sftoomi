<?php

namespace App\Class\Model;

class ExaminationModel extends AbstractModel
{
    protected function getBaseTable(): string
    {
        return "examination";
    }

    public function getAll(?int $start = null, ?int $limit = null, ?string $filters = null): array
    {
        $result = parent::getAll($start, $limit, $filters);

        foreach ($result["data"] as &$row) {
            $sql = "select es.exam_id, s.id, s.short_name, s.full_name
                    from examinations_studies es
                        left join study s on s.id = es.study_id
                    where es.examination_id = ?";
            $row["studies"] = $this->connection->fetchAll($sql, [$row["id"]]);

            $row["patient"] = new PatientModel($this->connection)->get($row["patient_id"]);
            $row["facility"] = new FacilityModel($this->connection)->get($row["facility_id"]);
            $row["doctor"] = new DoctorModel($this->connection)->get($row["doctor_id"]);

            unset(
                $row["doctor_id"],
                $row["facility_id"],
                $row["patient_id"]
            );
        }
        unset($row);

        return $result;
    }

    protected function getEntityColumns(): array
    {
        return [
            "id",
            "patient_id",
            "facility_id",
            "doctor_id",
            "date"
        ];
    }
}
