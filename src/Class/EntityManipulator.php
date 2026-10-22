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
                throw new \RuntimeException("entity_manipulator.unknown_id_field");
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
            throw new \RuntimeException("entity_manipulator.configuration_file_does_not_exist");
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
            throw new \RuntimeException(json_encode([
                "message"    => "entity_manipulator.id_field_not_set_for_reference",
                "parameters" => [
                    "%reference%" => $referenceTable,
                    "%config%"    => $removingEntityTable
                ]
            ]));
        }

        switch ($referenceConfig["onDelete"]) {
            case "restrict":
                $sql = "select count(*) > 0
                        from $referenceTable
                        where {$referenceConfig["idField"]} = ?";
                $recordsExists = $this->connection->selInt($sql, [$removingEntityId]);

                if ($recordsExists) {
                    throw new \RuntimeException(json_encode([
                        "message"    => "entity_manipulator.you_cannot_remove_the_record_with_id_s_from_s_table_because_it_has_dependencies_in_table_s",
                        "parameters" => [
                            "%entity_id%"       => $removingEntityId,
                            "%from_table%"      => $removingEntityTable,
                            "%dependent_table%" => $referenceTable
                        ]
                    ]));
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
