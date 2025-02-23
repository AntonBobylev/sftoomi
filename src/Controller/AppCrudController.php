<?php

namespace App\Controller;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Exception;
use Doctrine\ORM\EntityManagerInterface;
use RuntimeException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

class AppCrudController extends AbstractController
{
    protected string $baseTable = "";

    /** @var EntityManagerInterface */
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @throws Exception
     */
    public function getList(Request $request, array $selectColumns): array
    {
        $limit = $request->request->get("limit");
        $start = $request->request->get("start");
        $start = $limit * $start;

        $connection = $this->entityManager->getConnection();

        $data = $connection->createQueryBuilder()
            ->select($selectColumns)
            ->from($this->baseTable)
            ->setFirstResult($start)
            ->setMaxResults($limit)
            ->fetchAllAssociative();

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
