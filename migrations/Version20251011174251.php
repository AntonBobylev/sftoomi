<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20251011174251 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "Add some field for user entity";
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE users
                               ADD reset_password TINYINT(1) NOT NULL AFTER password,
                               ADD force_to_change_password TINYINT(1) NOT NULL AFTER reset_password,
                               ADD disabled TINYINT(1) NOT NULL AFTER id"
        );
    }

    public function down(Schema $schema): void
    {
        $this->addSql("ALTER TABLE users DROP reset_password, DROP force_to_change_password, DROP disabled");
    }
}
