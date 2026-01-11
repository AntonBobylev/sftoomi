<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260111103138 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "Description column added to the permissions table";
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE permissions ADD description VARCHAR(255) NOT NULL");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("ALTER TABLE permissions DROP description");
    }
}
