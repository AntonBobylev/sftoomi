<?php

namespace App\Class\Model;

class FacilityModel extends AbstractModel
{
    protected function getBaseTable(): string
    {
        return "facility";
    }

    public function getAll(
        ?int $start = null,
        ?int $limit = null,
        ?string $filters = null,
        ?string $orderByField = "id",
        ?string $orderByDirection = "asc"
    ): array
    {
        $result = parent::getAll($start, $limit);

        $facilities = $result["data"];
        foreach ($facilities as &$facility) {
            $sql = "select d.id, d.last_name, d.first_name, d.middle_name
                    from facilities_doctors fd
                        left join doctor d on d.id = fd.doctor_id
                    where fd.facility_id = ?";
            $facility["facility_doctors"] = $this->connection->fetchAll($sql, [$facility["id"]]);
        }
        unset($facility);

        return [
            "data"  => $facilities,
            "total" => $result["total"]
        ];
    }

    protected function getEntityColumns(): array
    {
        return [
            "id",
            "short_name",
            "full_name"
        ];
    }
}
