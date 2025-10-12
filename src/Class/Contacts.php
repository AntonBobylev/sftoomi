<?php

namespace App\Class;

use Doctrine\DBAL\Connection;

final class Contacts
{
    public function __construct(private readonly Connection $connection)
    {
    }

    public function get(?int $contactId): ?array
    {
        if (empty($contactId)) {
            return null;
        }

        $sql = "select item_id, type, text, position
                from contacts
                where contact_id = ?";
        $data = $this->connection->fetchAllAssociative($sql, [$contactId]);

        return [
            "contact_id" => $contactId,
            "contacts"   => $data,
        ];
    }
}
