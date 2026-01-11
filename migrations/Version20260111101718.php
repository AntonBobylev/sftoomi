<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260111101718 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "Creating the permissions table";
    }

    public function up(Schema $schema): void
    {
        $this->addSql("CREATE TABLE permissions (
                               id INT AUTO_INCREMENT NOT NULL,
                               name VARCHAR(255) NOT NULL,
                               UNIQUE INDEX UNIQ_2DEDCC6F5E237E06 (name),
                               PRIMARY KEY(id)
                           ) DEFAULT CHARACTER SET utf8mb4
                             COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB"
        );
    }

    public function down(Schema $schema): void
    {
        $this->addSql("DROP TABLE permissions");
    }
}
