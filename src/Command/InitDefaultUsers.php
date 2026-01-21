<?php

namespace App\Command;

use App\Class\Constants;
use App\Class\Contacts;
use App\Class\Core\DB\Connection;
use App\Class\Entity\User;
use App\Class\Utils\PasswordGenerator;
use Psr\Log\LogLevel;
use RuntimeException;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Yaml\Yaml;
use Throwable;

class InitDefaultUsers extends SftoomiCommand
{
    private const string DEFAULT_USERS_CONFIG_FILE = __DIR__ . "/../../data/default_users.yml";

    private const array REQUIRED_USER_FIELDS = [
        "login",
        "first_name",
        "last_name",
        "disabled",
        "email"
    ];

    public function __construct(
        Connection $connection,
        Filesystem $filesystem,
        private readonly User $user,
        private readonly Contacts $contacts,
        private readonly UserPasswordHasherInterface $passwordHasher
    )
    {
        parent::__construct($connection, $filesystem);
    }

    protected function configure(): void
    {
        $this
            ->setName("domain:init-default-users")
            ->setDescription("Initialize default users");
    }

    /**
     * @throws Throwable
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->log("Loading default users config...", $output);
        $defaultUsers = $this->getDefaultUsers();
        $this->log("Default users config loaded", $output);

        $progress = $this->createProgressBar($output, count($defaultUsers));
        $this->log("", $output);

        foreach ($defaultUsers as $user) {
            try {
                $this->assertAllRequiredFieldsSet($user);
            } catch (Throwable $e) {
                $this->log(sprintf("%s. Skipping this user...", $e->getMessage()), $output, LogLevel::WARNING);

                continue;
            }

            $this->addUserIfRequired($user);

            $progress->advance();
        }

        $progress->finish();
        $this->log("\nOperation successfully completed", $output);

        return Command::SUCCESS;
    }

    /**
     * @return array
     */
    private function getDefaultUsers(): array
    {
        $config = $this->filesystem->readFile(self::DEFAULT_USERS_CONFIG_FILE);

        return Yaml::parse($config);
    }

    /**
     * @param array $user
     *
     * @return void
     */
    private function assertAllRequiredFieldsSet(array $user): void
    {
        foreach (self::REQUIRED_USER_FIELDS as $field) {
            if (!isset($user[$field])) {
                throw new RuntimeException(sprintf("Missing required field \"%s\" for user: \"%s\"", $field, json_encode($user)));
            }
        }
    }

    /**
     * @param array $userData
     *
     * @return void
     *
     * @throws Throwable
     */
    private function addUserIfRequired(array $userData): void
    {
        $sql = "select id from users where login = ?";
        $userId = $this->connection->selInt($sql, [$userData["login"]]);

        if (isset($userId)) {
            return;
        }

        try {
            $this->connection->beginTransaction();

            $userId = $this->user->add(
                $userData["login"],
                $this->passwordHasher->hashPassword(new \App\Entity\User(), new PasswordGenerator()->generate()),
                $userData
            );

            $contactId = $this->contacts->set([
                "contact_id" => null,
                "contacts"   => [[
                    "text"     => $userData["email"],
                    "type"     => Constants::CONTACT_TYPE_EMAIL,
                    "position" => 0
                ]]
            ]);

            $this->connection->update(
                "users",
                ["contact_id" => $contactId],
                "id = ?",
                [$userId]
            );

            if (!empty($userData["groups"])) {
                $sql = "select id
                        from `groups`
                        where name in ?";
                $groupIds = $this->connection->fetchCol($sql, [$userData["groups"]]);

                if (!empty($groupIds)) {
                    $this->connection->delete(
                        "users_groups",
                        "user_id = ?",
                        [$userId]
                    );

                    foreach ($groupIds as $groupId) {
                        $this->connection->insert(
                            "users_groups",
                            [
                                "user_id"  => $userId,
                                "group_id" => $groupId
                            ]
                        );
                    }
                }
            }

            $this->connection->commit();
        } catch (Throwable $e) {
            $this->connection->rollBack();
            throw $e;
        }
    }
}
