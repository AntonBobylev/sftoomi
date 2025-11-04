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
    public function get(int $id): array
    {
        $sql = "select {$this->getEntityInlineColumns()}
                from {$this->getBaseTable()}
                where id = ?";

        return $this->connection->fetchRow($sql, [$id]);
    }

    /**
     * @throws Exception
     */
    public function getAll(?int $start = null, ?int $limit = null): array
    {
        $sql = "select {$this->getEntityInlineColumns()}
                from {$this->getBaseTable()}";

        if (isset($start) & isset($limit)) {
            $sql .= " limit $start, $limit";
        }

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
