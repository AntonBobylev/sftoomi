<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250427140226 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE examinations_studies DROP PRIMARY KEY;');
        $this->addSql('ALTER TABLE examinations_studies ADD COLUMN exam_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE examinations_studies DROP COLUMN exam_id;');
        $this->addSql('ALTER TABLE examinations_studies DROP PRIMARY KEY;');
        $this->addSql('ALTER TABLE examinations_studies ADD PRIMARY KEY (examination_id, study_id)');
    }
}
