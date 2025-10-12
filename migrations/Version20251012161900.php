<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20251012161900 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "Add contact ID to contacts table";
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE contacts ADD contact_id INT NOT NULL AFTER id");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("ALTER TABLE contacts DROP contact_id");
    }
}
