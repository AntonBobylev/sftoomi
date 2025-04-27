<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250427213651 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "";
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE examination ADD date DATE NOT NULL");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("ALTER TABLE examination DROP date");
    }
}
