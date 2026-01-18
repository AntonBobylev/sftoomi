<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260118114924 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "Remove roles column in users table. Add users_groups table";
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE users DROP roles");
        $this->addSql("CREATE TABLE users_groups (
                               user_id  INT UNSIGNED NOT NULL,
                               group_id INT UNSIGNED NOT NULL,
                               PRIMARY KEY(user_id, group_id)
                           )
                           DEFAULT CHARACTER SET utf8mb4
                           COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB"
        );
    }

    public function down(Schema $schema): void
    {
        $this->addSql("ALTER TABLE users ADD roles JSON NOT NULL");
    }
}
