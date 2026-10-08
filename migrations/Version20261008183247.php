<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261008183247 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "";
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE patient ADD gender SMALLINT DEFAULT NULL COMMENT '0 - male, 1 - female, null - unspecified'");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("ALTER TABLE patient DROP gender");
    }
}
