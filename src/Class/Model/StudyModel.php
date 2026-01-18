<?php

namespace App\Class\Model;

class StudyModel extends AbstractModel
{
    protected function getBaseTable(): string
    {
        return "study";
    }

    public function get(?int $id, ?string $filters = null): array
    {
        $data = parent::get($id, $filters);
        $data["study_cpts"] = $this->getStudyCpts($data["id"]);

        return $data;
    }

    public function getAll(
        ?int $start = null,
        ?int $limit = null,
        ?string $filters = null,
        ?string $orderByField = "id",
        ?string $orderByDirection = "asc"
    ): array
    {
        $result = parent::getAll($start, $limit, $filters);

        foreach ($result["data"] as &$row) {
            $row["study_cpts"] = $this->getStudyCpts($row["id"]);
        }
        unset($row);

        return $result;
    }

    protected function getEntityColumns(): array
    {
        return [
            "id",
            "short_name",
            "full_name"
        ];
    }

    private function getStudyCpts(int $studyId): array
    {
        $sql = "select cpt_id
                from studies_cpts
                where study_id = ?";
        $studyCptsIds = $this->connection->fetchCol($sql, [$studyId]);
        if (empty($studyCptsIds)) {
            return [];
        }

        return new CptModel($this->connection)->getAll(
            null,
            null,
            $this->connection->subst("id in ?", [$studyCptsIds])
        )["data"];
    }
}
