<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20251019191118 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "Reset password column removed from users table";
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE users DROP reset_password");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("ALTER TABLE users ADD reset_password TINYINT(1) NOT NULL");
    }
}
