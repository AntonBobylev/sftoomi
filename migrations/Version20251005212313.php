<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20251005212313 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "Create sessions table for storing PHP sessions";
    }

    public function up(Schema $schema): void
    {
        $this->addSql("CREATE TABLE sessions (
            session_id VARBINARY(128) NOT NULL PRIMARY KEY,
            session_data BLOB NOT NULL,
            session_lifetime INTEGER UNSIGNED NOT NULL,
            session_time INTEGER UNSIGNED NOT NULL,
            INDEX sessions_session_lifetime_idx (session_lifetime)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_bin` ENGINE = InnoDB");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE sessions');

    }
}
