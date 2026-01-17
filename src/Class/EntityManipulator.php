<?php

namespace App\Class;

use App\Utils;
use App\Class\Core\DB\Connection;

class EntityManipulator
{
    private readonly string $configFilePath;
    private array $config;

    private Connection $connection;

    public function __construct($connection)
    {
        $this->configFilePath = Utils::getVars()->get("entities_relationships_file_path");
        $this->connection = $connection;
    }

    public function remove(string $entityTable, array $ids, string | null $idField = null): void
    {
        if (empty($this->config)) {
            $this->loadConfig();
        }

        $entityTableConfig = null;
        if (!empty($this->config[$entityTable])) {
            $entityTableConfig = $this->config[$entityTable];
        }

        foreach ($ids as $id) {
            if (!empty($entityTableConfig) && !empty($entityTableConfig["references"])) {
                foreach ($entityTableConfig["references"] as $table => $config) {
                    $this->processReference(
                        $id,
                        $entityTable,
                        $table,
                        $config
                    );
                }
            }

            $idFieldToRemove = $idField ?? $entityTableConfig["idField"];
            if (!$idFieldToRemove) {
                throw new \RuntimeException("Unknown idField");
            }

            $this->connection->delete(
                $entityTable,
                "{$idFieldToRemove} = ?",
                [$id]
            );
        }
    }

    private function loadConfig(): void
    {
        if (!file_exists($this->configFilePath)) {
            throw new \RuntimeException("Configuration file does not exist");
        }

        $fileContent = file_get_contents($this->configFilePath);

        $this->config = json_decode($fileContent, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \RuntimeException(json_last_error_msg());
        }
    }

    private function processReference(
        int    $removingEntityId,
        string $removingEntityTable,
        string $referenceTable,
        array  $referenceConfig
    ): void
    {
        if (empty($referenceConfig["idField"])) {
            throw new \RuntimeException(sprintf(
                "idField is not set for reference \"%s\" in %s config ",
                $referenceTable,
                $removingEntityTable
            ));
        }

        switch ($referenceConfig["onDelete"]) {
            case "restrict":
                $sql = "select count(*) > 0
                        from $referenceTable
                        where {$referenceConfig["idField"]} = ?";
                $recordsExists = $this->connection->selInt($sql, [$removingEntityId]);

                if ($recordsExists) {
                    throw new \RuntimeException(sprintf(
                        "You cannot remove the record with ID %s from \"%s\" table because it has dependencies in table \"%s\"",
                        $removingEntityId,
                        $removingEntityTable,
                        $referenceTable
                    ));
                }

                break;
            case "update":
                $this->remove(
                    $referenceTable,
                    [$removingEntityId],
                    $referenceConfig["idField"]
                );

                break;
        }
    }
}
