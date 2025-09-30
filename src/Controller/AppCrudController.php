<?php

namespace App\Controller;

use App\Class\EntityManipulator;
use App\Class\Fetcher;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Exception;
use RuntimeException;
use Symfony\Component\HttpFoundation\Request;

abstract class AppCrudController extends SftoomiController
{
    protected string $baseTable;

    /**
     * @throws Exception
     */
    public function getList(Request $request, array $selectColumns, string | null $where = null): array
    {
        $limit = $request->request->get("limit");
        $start = $request->request->get("start");
        $start = $limit * $start;

        $connection = $this->entityManager->getConnection();

        $query = $connection->createQueryBuilder()
            ->select($selectColumns)
            ->from($this->baseTable)
            ->setFirstResult($start)
            ->setMaxResults($limit);

        if (!empty($where)) {
            $query->where($where);
        }

        $data = $query->fetchAllAssociative();

        $sql = "select found_rows()";
        $total = $connection->fetchOne($sql);

        return [
            "data"  => $data,
            "total" => $total
        ];
    }

    /**
     * @throws Exception
     */
    public function getOne(Request $request, array $selectColumns): array
    {
        $id = $request->request->get("id");

        $entity = $this->entityManager
            ->getConnection()
            ->createQueryBuilder()
            ->select($selectColumns)
            ->from($this->baseTable)
            ->where("id = $id")
            ->fetchAssociative();

        if (empty($entity)) {
            throw new RuntimeException(sprintf("Entity with ID %s not found in table %s", $id, $this->baseTable));
        }

        return $entity;
    }

    /**
     * @throws Exception
     */
    public function save(Request $request, array $values, array $requiredFields = []): array
    {
        $this->assertAllRequiredFieldsSet($requiredFields, $values);

        $id = $request->request->get("id");

        $connection = $this->entityManager->getConnection();
        if (isset($id)) { {
            $connection->update(
                $this->baseTable,
                $values,
                ["id" => $values["id"]]
            );
        }} else {
            $connection->insert(
                $this->baseTable,
                $values
            );

            $id = $connection->lastInsertId();
        }

        return [
            "id" => $id
        ];
    }

    /**
     * @param Request $request
     *
     * @return void
     */
    public function remove(Request $request): void
    {
        $ids = Fetcher::intArray($request->request->get("ids"));

        if (empty($ids)) {
            throw new RuntimeException("At least one ID is required for removal operation");
        }

        try {
            $this->connection->beginTransaction();

            new EntityManipulator($this->connection)
                ->remove($this->baseTable, $ids);
        } catch (\Exception $e) {
            $this->connection->rollback();

            throw new \RuntimeException("Failed to remove an entity due to error: " . $e->getMessage());
        }

        $this->connection->commit();
    }

    protected function assertAllRequiredFieldsSet(array $requiredFields, array $values): void
    {
        if (empty($requiredFields)) {
            return;
        }

        if (empty($values)) {
            throw new \InvalidArgumentException(sprintf(
                "Required fields for the operation: %s",
                implode(", ", $requiredFields)
            ));
        }

        foreach ($requiredFields as $field) {
            if (empty($values[$field])) {
                throw new \InvalidArgumentException(sprintf(
                    "Field %s is required",
                    $field
                ));
            }
        }
    }
}
