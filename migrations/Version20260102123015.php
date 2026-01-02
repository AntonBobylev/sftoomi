<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260102123015 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "Rename examination table to examinations";
    }

    public function up(Schema $schema): void
    {
        $this->addSql("rename table examination to examinations");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("rename table examinations to examination");
    }
}
