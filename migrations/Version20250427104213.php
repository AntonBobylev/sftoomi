<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250427104213 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE examination (
                               id INT AUTO_INCREMENT NOT NULL,
                               patient_id INT NOT NULL,
                               facility_id INT NOT NULL,
                               doctor_id INT DEFAULT NULL,
                               PRIMARY KEY(id)
                         ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        $this->addSql("CREATE TABLE examinations_studies (
                               examination_id INT UNSIGNED NOT NULL,
                               study_id INT UNSIGNED NOT NULL,
                               PRIMARY KEY(examination_id, study_id)
                           ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE examination');
        $this->addSql('DROP TABLE examinations_studies');
    }
}
