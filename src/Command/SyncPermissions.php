<?php

namespace App\Command;

use Doctrine\DBAL\Exception;
use RuntimeException;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class SyncPermissions extends SftoomiCommand
{
    private const string PERMISSIONS_CONFIG = __DIR__ . "/../../data/permissions.conf";

    protected function configure(): void
    {
        $this
            ->setName("app:sync-permissions")
            ->setDescription("Synchronize permissions from config file to database")
        ;
    }

    /**
     * @throws Exception
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $newPermissionsConfig = $this->loadPermissionsList();

        $sql = "select id, name, description from permissions";
        $existingPermissions = $this->connection->fetchAll($sql);

        $updatedPermissionsIds = [];
        foreach ($newPermissionsConfig as $newPermissionConfig) {
            $newPermissionsConfig = array_map(
                function($item) {
                    return trim($item);
                },
                explode("|", $newPermissionConfig)
            );

            [$newPermissionName, $newPermissionDescription] = $newPermissionsConfig;
            if (!isset($newPermissionName, $newPermissionDescription)) {
                throw new RuntimeException(sprintf("Permission name or description wasn't set: %s", json_encode($newPermissionConfig)));
            }

            $sql = "select id, name, description
                    from permissions
                    where name = ?";
            $dbPermission = $this->connection->fetchRow($sql, [$newPermissionName]);

            $permissionId = null;
            if (!empty($dbPermission)) {
                $permissionId = $dbPermission["id"];
                $updatedPermissionsIds[] = $permissionId;
            }

            if (isset($permissionId) && $dbPermission["name"] === $newPermissionName && $dbPermission["description"] === $newPermissionDescription) {
                // nothing to do
                continue;
            }

            $output->writeln(sprintf("Adding/Updating permission: %s|%s", $newPermissionName, $newPermissionDescription));

            $this->connection->insupd(
                "permissions",
                [
                    "id"          => $permissionId,
                    "name"        => $newPermissionName,
                    "description" => $newPermissionDescription
                ],
                "id = ?",
                [$permissionId]
            );
        }

        foreach ($existingPermissions as $permission) {
            if (in_array($permission["id"], $updatedPermissionsIds)) {
                continue;
            }

            $output->writeln(sprintf("Removing permission: %s|%s", $permission["name"], $permission["description"]));

            $this->connection->delete(
                "permissions",
                "id = ?",
                [$permission["id"]]
            );
        }

        return Command::SUCCESS;
    }

    private function loadPermissionsList(): array
    {
        if (!$this->filesystem->exists([self::PERMISSIONS_CONFIG])) {
            throw new RuntimeException(sprintf("Permissions config file does not exist: %s", self::PERMISSIONS_CONFIG));
        }

        $lines = file(self::PERMISSIONS_CONFIG, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        return array_values(array_unique(array_filter($lines, function ($line) {
            return !empty($line) && !str_starts_with($line, "#");
        })));
    }
}
