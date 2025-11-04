<?php

namespace App\Class\Model;

class StudyModel extends AbstractModel
{
    protected function getBaseTable(): string
    {
        return "study";
    }

    public function getAll(?int $start = null, ?int $limit = null, ?string $filters = null): array
    {
        $result = parent::getAll($start, $limit, $filters);

        foreach ($result["data"] as &$row) {
            $sql = "select cpt_id
                    from studies_cpts
                    where study_id = ?";
            $studyCptsIds = $this->connection->fetchCol($sql, [$row["id"]]);

            $cptModel = new CptModel($this->connection);
            $row["study_cpts"] = $cptModel->getAll(
                null,
                null,
                $this->connection->subst("id in ?", [$studyCptsIds])
            )["data"];
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
}
