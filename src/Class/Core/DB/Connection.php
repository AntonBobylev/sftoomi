<?php

namespace App\Class\Core\DB;

use Doctrine\DBAL\Connection as DBALConnection;
use Doctrine\DBAL\Exception;

readonly class Connection
{
    private SqlSubstitutor $substitutor;
    private DBALConnection $connection;

    public function __construct(DBALConnection $connection)
    {
        $this->connection  = $connection;
        $this->substitutor = new SqlSubstitutor();
    }

    /**
     * @throws Exception
     */
    public function beginTransaction(): void
    {
        $this->connection->beginTransaction();
    }

    /**
     * @throws Exception
     */
    public function commit(): void
    {
        $this->connection->commit();
    }

    /**
     * @throws Exception
     */
    public function rollback(): void
    {
        $this->connection->rollback();
    }

    /**
     * @throws Exception
     */
    public function now(): string | null
    {
        return $this->selString("select now()");
    }

    /**
     * @throws Exception
     */
    public function fetchAll(string $sql, array $params = []): array
    {
        return $this->connection->fetchAllAssociative($this->subst($sql, $params));
    }

    /**
     * @throws Exception
     */
    public function fetchRow(string $sql, array $params = []): array
    {
        $data = $this->connection->fetchAssociative($this->subst($sql, $params));
        if ($data === false) {
            $data = [];
        }

        return $data;
    }

    /**
     * @throws Exception
     */
    public function fetchCol(string $sql, array $params = []): array
    {
        return $this->connection->fetchFirstColumn($this->subst($sql, $params));
    }

    /**
     * @throws Exception
     */
    public function selInt(string $sql, array $params = []): int | null
    {
        $data = $this->connection->fetchOne($this->subst($sql, $params));

        if ($data === false || !is_numeric($data)) {
            return null;
        }

        return intval($data);
    }

    /**
     * @throws Exception
     */
    public function selFloat(string $sql, array $params = []): float | null
    {
        $data = $this->connection->fetchOne($this->subst($sql, $params));

        if ($data === false || !is_numeric($data)) {
            return null;
        }

        return floatval($data);
    }

    /**
     * @throws Exception
     */
    public function selString(string $sql, array $params = []): string | null
    {
        $data = $this->connection->fetchOne($this->subst($sql, $params));

        if ($data === false || !is_string($data)) {
            return null;
        }

        return $data;
    }

    public function subst(string $sql, array $params): string
    {
        return $this->substitutor->subst($sql, $params);
    }

    /**
     * @throws Exception
     */
    public function getFoundRows(): int
    {
        $sql = "select found_rows()";

        return $this->selInt($sql);
    }

    /**
     * @throws Exception
     */
    public function execute(string $sql): string
    {
        return $this->connection->executeStatement($sql);
    }

    /**
     * @throws Exception
     */
    public function insupd(string $table, array $values, string $where = "true", array $params = []): bool | int | string
    {
        $sql = "select *
                from `$table`
                where $where";
        $rows = $this->fetchCol($sql, $params);

        if (count($rows) > 0) {
            $result = $this->update($table, $values, $where, $params);
        } else {
            $result = $this->insert($table, $values);
        }

        return $result;
    }

    /**
     * @throws Exception
     */
    public function update(string $table, array $values, string $where = "true", array $params = []): bool | int | string
    {
        if (!isset($values)) {
            return false;
        }

        if (count($values) === 0) {
            return false;
        }

        $setSql = "";
        foreach ($values as $field => $value) {
            if ($setSql !== "") {
                $setSql .= ", ";
            }
            $setSql .= $this->substitutor->encodeName($field) . " = " . $this->substitutor->encodeValue($value);
        }

        $where = $this->subst($where, $params);

        return $this->connection->executeStatement("update `$table` set $setSql where $where");
    }

    /**
     * @throws Exception
     */
    public function insert(string $table, array $values): bool | int | string
    {
        $fields = array_keys($values);
        $valuesSql = "";
        foreach ($values as $value) {
            if ($valuesSql !== "") {
                $valuesSql .= ", ";
            }
            $valuesSql .= $this->substitutor->encodeValue($value);
        }

        $fieldsSql = $this->substitutor->encodeFields($fields);

        return $this->connection->executeStatement("insert into `$table` ($fieldsSql) values ($valuesSql)");
    }

    /**
     * @throws Exception
     */
    public function delete(string $table, string $where = "true", array $params = []): bool | int | string
    {
        $where = $this->subst($where, $params);

        return $this->connection->executeStatement("delete from `$table` where $where");
    }

    /**
     * @throws Exception
     */
    public function getLastInsertId(): bool | int | string
    {
        return $this->connection->lastInsertId();
    }
}
