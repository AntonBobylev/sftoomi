<?php

namespace App\Class\Model;

class TemplateModel extends AbstractModel
{
    protected function getBaseTable(): string
    {
        return "template";
    }

    public function get(?int $id, ?string $filters = null): array
    {
        $data = parent::get($id, $filters);
        $data["allowed_studies"] = $this->getTemplateAllowedStudies($data["id"]);

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
            $row["allowed_studies"] = $this->getTemplateAllowedStudies($row["id"]);
        }
        unset($row);

        return $result;
    }

    protected function getEntityColumns(): array
    {
        return [
            "id",
            "name",
            "content"
        ];
    }

    private function getTemplateAllowedStudies(int $studyId): array
    {
        $sql = "select study_id
                from templates_studies
                where template_id = ?";
        $templateAllowedStudies = $this->connection->fetchCol($sql, [$studyId]);
        if (empty($templateAllowedStudies)) {
            return [];
        }

        return new StudyModel($this->connection)->getAll(
            null,
            null,
            $this->connection->subst("id in ?", [$templateAllowedStudies])
        )["data"];
    }
}
