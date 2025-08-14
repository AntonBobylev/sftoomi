<?php

namespace App\Class\Examination;

use Doctrine\DBAL\Connection;

final class Fixer
{
    private Connection $connection;

    public function __construct($connection)
    {
        $this->connection = $connection;
    }

    public function remove(int $examinationId): void
    {
        $this->assertExaminationExists($examinationId);

        $this->connection->beginTransaction();

        try {
            $this->connection->delete("examinations_studies", ["examination_id" => $examinationId]);
            $this->connection->delete("examination", ["id" => $examinationId]);
        } catch (\Throwable $exception) {
            $this->connection->rollBack();

            throw new \RuntimeException(sprintf("There was a problem at the examination saving process: %s", $exception->getMessage()));
        }

        $this->connection->commit();
    }

    private function assertExaminationExists(int $examinationId): void
    {
        $sql = "select count(*) > 0 from examination where id = ?";
        $examExists = boolval($this->connection->fetchNumeric($sql, [$examinationId]));

        if (!$examExists) {
            throw new \RuntimeException(sprintf("Examination with ID %s doesn't exist", $examinationId));
        }
    }
}
