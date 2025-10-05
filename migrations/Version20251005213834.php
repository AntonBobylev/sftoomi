<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20251005213834 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "User entity added";
    }

    public function up(Schema $schema): void
    {
        $this->addSql("CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, login VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(255) DEFAULT NULL, last_name VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', UNIQUE INDEX UNIQ_1483A5E9AA08CB10 (login), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB");
        $this->addSql("ALTER TABLE sessions CHANGE session_data session_data LONGBLOB NOT NULL");
        $this->addSql("ALTER TABLE sessions RENAME INDEX sessions_session_lifetime_idx TO session_lifetime_idx");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("DROP TABLE users");
        $this->addSql("ALTER TABLE sessions CHANGE session_data session_data BLOB NOT NULL");
        $this->addSql("ALTER TABLE sessions RENAME INDEX session_lifetime_idx TO sessions_session_lifetime_idx");
    }
}
