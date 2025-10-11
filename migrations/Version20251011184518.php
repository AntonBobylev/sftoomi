<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20251011184518 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "Contacts table added, contactId field added to user entity";
    }

    public function up(Schema $schema): void
    {
        $this->addSql("CREATE TABLE contacts (
                               id INT AUTO_INCREMENT NOT NULL,
                               item_id INT NOT NULL,
                               type VARCHAR(7) NOT NULL,
                               text VARCHAR(500) NOT NULL,
                               position SMALLINT NOT NULL,
                               PRIMARY KEY(id)
                           ) DEFAULT CHARACTER SET utf8mb4
                             COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB"
        );
        $this->addSql("ALTER TABLE users ADD contact_id INT DEFAULT NULL");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("DROP TABLE contacts");
        $this->addSql("ALTER TABLE users DROP contact_id");
    }
}
