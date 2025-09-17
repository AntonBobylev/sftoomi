<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250917205701 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "";
    }

    public function up(Schema $schema): void
    {
        $this->addSql("CREATE TABLE template (
                               id INT AUTO_INCREMENT NOT NULL,
                               name VARCHAR(255) NOT NULL,
                               PRIMARY KEY(id)
                           ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB");


        $this->addSql("CREATE TABLE templates_studies (
                               template_id INT UNSIGNED NOT NULL,
                               study_id INT UNSIGNED NOT NULL,
                               PRIMARY KEY(template_id, study_id)
                           ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("DROP TABLE template");
        $this->addSql("DROP TABLE templates_studies");
    }
}
