<?php

namespace App\Class\Model;

class DoctorModel extends AbstractModel
{
    protected function getBaseTable(): string
    {
        return "doctor";
    }

    public function getAll(?int $start = null, ?int $limit = null, ?string $filters = null): array
    {
        $result = parent::getAll($start, $limit);

        $doctors = $result["data"];
        foreach ($doctors as &$doctor) {
            $sql = "select f.id, f.short_name, f.full_name
                    from facilities_doctors fd
                        left join facility f on f.id = fd.facility_id
                    where fd.doctor_id = ?";
            $doctor["doctor_facilities"] = $this->connection->fetchAll($sql, [$doctor["id"]]);
        }
        unset($doctor);

        return [
            "data"  => $doctors,
            "total" => $result["total"]
        ];
    }

    protected function getEntityColumns(): array
    {
        return [
            "id",
            "last_name",
            "first_name",
            "middle_name"
        ];
    }
}
