<?php

namespace App\Class\Model;

use App\Class\Core\DB\Connection;
use Doctrine\DBAL\Exception;

abstract class AbstractModel
{
    protected abstract function getBaseTable(): string;

    protected abstract function getEntityColumns(): array;

    public function __construct(protected readonly Connection $connection)
    {
    }

    /**
     * @throws Exception
     */
    public function get(?int $id, ?string $filters = null): array
    {
        if (empty($id) && empty($filters)) {
            return [];
        }

        $idFilter = empty($id)
            ? "true"
            : $this->connection->subst("id = ?", [$id]);

        if (empty($filters)) {
            $filters = "true";
        }

        $sql = "select {$this->getEntityInlineColumns()}
                from {$this->getBaseTable()}
                where $idFilter and $filters";

        return $this->connection->fetchRow($sql);
    }

    /**
     * @throws Exception
     */
    public function getAll(
        ?int $start = null,
        ?int $limit = null,
        ?string $filters = null,
        ?string $orderByField = "id",
        ?string $orderByDirection = "asc"
    ): array
    {
        if (empty($filters)) {
            $filters = "true";
        }

        $orderSql = "";
        if (isset($orderByField)) {
            $orderSql = "order by `$orderByField`";

            if (isset($orderByDirection)) {
                $orderSql .= " " . $orderByDirection;
            }
        }

        $limitSql = "";
        if (isset($start) && isset($limit)) {
            $limitSql = $this->connection->subst("limit ?, ?", [$start, $limit]);
        }

        $sql = "select {$this->getEntityInlineColumns()}
                from {$this->getBaseTable()}
                where $filters
                $orderSql
                $limitSql";

        return [
            "data"  => $this->connection->fetchAll($sql),
            "total" => $this->connection->getFoundRows()
        ];
    }

    protected function getEntityInlineColumns(): string
    {
        return implode(', ', $this->getEntityColumns());
    }
}
