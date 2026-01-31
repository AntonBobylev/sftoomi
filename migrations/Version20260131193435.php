<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260131193435 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "Content column added";
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE template ADD content LONGTEXT NOT NULL");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("ALTER TABLE template DROP content");
    }
}
