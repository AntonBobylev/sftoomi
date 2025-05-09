<?php

namespace App\Controller;

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

        $sql = sprintf("select count(*) from %s", $this->baseTable);
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
    public function save(Request $request, array $values): array
    {
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
     * @param ServiceEntityRepository $entityRepository
     * @param Request $request
     *
     * @return void
     */
    public function remove(ServiceEntityRepository $entityRepository, Request $request): void
    {
        $ids = $request->request->get("ids");

        if (empty($ids)) {
            throw new RuntimeException("At least one id is required for removal operation");
        }

        $ids = explode(",", $ids);

        $entities = $entityRepository->findBy(["id" => $ids]);
        foreach ($entities as $entity) {
            $this->entityManager->remove($entity);
        }

        $this->entityManager->flush();
    }
}
