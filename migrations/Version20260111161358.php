<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260111161358 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "Added groups and groups_permissions tables";
    }

    public function up(Schema $schema): void
    {
        $this->addSql("CREATE TABLE `groups` (
                               id INT AUTO_INCREMENT NOT NULL,
                               name VARCHAR(255) NOT NULL,
                               UNIQUE INDEX UNIQ_F06D39705E237E06 (name),
                               PRIMARY KEY(id)
                           ) 
                           DEFAULT CHARACTER SET utf8mb4
                           COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB"
        );

        $this->addSql("CREATE TABLE groups_permissions (
                               group_id INT UNSIGNED NOT NULL,
                               permission_id INT UNSIGNED NOT NULL,
                               PRIMARY KEY(group_id, permission_id)
                           )
                           DEFAULT CHARACTER SET utf8mb4
                           COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB"
        );
    }

    public function down(Schema $schema): void
    {
        $this->addSql("DROP TABLE `groups`");
        $this->addSql("DROP TABLE `groups_permissions`");
    }
}
