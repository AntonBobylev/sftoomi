<?php

namespace App\Command;

use Psr\Log\LogLevel;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Yaml\Yaml;
use Throwable;

class InitDefaultGroups extends SftoomiCommand
{
    private const string DEFAULT_GROUPS_CONFIG_FILE = __DIR__ . "/../../data/default_groups.yml";

    protected function configure(): void
    {
        $this
            ->setName("domain:init-default-groups")
            ->setDescription("Initialize default groups");
    }

    /**
     * @throws Throwable
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->log("Loading default groups config...", $output);
        $defaultGroups = $this->getDefaultGroups();
        $this->log("Default users config loaded", $output);

        if (empty($defaultGroups)) {
            $this->log("No default groups specified", $output);

            return Command::SUCCESS;
        }

        $progress = $this->createProgressBar($output, count($defaultGroups));
        $this->log("", $output);

        foreach ($defaultGroups as $group) {
            $sql = "select count(*) > 0
                    from `groups`
                    where name = ?";
            $groupExists = $this->connection->selInt($sql, [$group["name"]]);
            if ($groupExists) {
                $this->log(
                    sprintf(
                        "The group with the name \"%s\" already exists. Skipping this group...",
                        $group["name"]
                    ),
                    $output
                );

                continue;
            }

            $sql = "select id
                    from permissions
                    where name in ?";
            $permissionsIds = $this->connection->fetchCol($sql, [$group["permissions"]]);

            if (empty($permissionsIds)) {
                $this->log(
                    sprintf(
                        "Permissions cannot be found in the database for the group with the name \"%s\". Skipping this group...",
                        $group["name"]
                    ),
                    $output,
                    LogLevel::WARNING
                );

                continue;
            }

            $this->connection->insert(
                "groups",
                [
                    "name" => $group["name"]
                ]
            );

            $groupId = $this->connection->getLastInsertId();
            foreach ($permissionsIds as $permissionId) {
                $this->connection->insert(
                    "groups_permissions",
                    [
                        "group_id"      => $groupId,
                        "permission_id" => $permissionId
                    ]
                );
            }
        }

        $progress->finish();
        $this->log("\nOperation successfully completed", $output);

        return Command::SUCCESS;
    }

    /**
     * @return array
     */
    private function getDefaultGroups(): array
    {
        $config = $this->filesystem->readFile(self::DEFAULT_GROUPS_CONFIG_FILE);

        return Yaml::parse($config);
    }
}
