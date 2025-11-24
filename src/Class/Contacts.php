<?php

namespace App\Class;

use App\Class\Core\DB\Connection;

final class Contacts
{
    public function __construct(private readonly Connection $connection)
    {
    }

    public function get(?int $contactId, ?array $types = []): ?array
    {
        if (empty($contactId)) {
            return null;
        }

        $filters = [];
        if (!empty($types)) {
            $filters[] = $this->connection->subst("type in ?", [$types]);
        }

        $filters = empty($filters) ? "true" : implode(" and ", $filters);

        $sql = "select item_id, type, text, position
                from contacts
                where contact_id = ?
                    and $filters
                order by position";
        $data = $this->connection->fetchAll($sql, [$contactId]);

        return [
            "contact_id" => $contactId,
            "contacts"   => $data
        ];
    }

    public function set(array $value): int | null
    {
        $contactId = $value["contact_id"];
        $contacts = $value["contacts"];

        if (empty($contactId) && empty($contacts)) {
            return null;
        } else if (empty($contactId)) {
            $contactId = $this->getNewContactId();
        } else {
            $sql = "select item_id
                    from contacts
                    where contact_id = ?";
            $contactItems = $this->connection->fetchCol($sql, [$contactId]);

            $currentContactItemIds = array_map(function ($contact) {
                return $contact["item_id"];
            }, $contacts);

            $contactItemsIdsToRemove = array_diff($contactItems, array_filter($currentContactItemIds, function($item) {
                return $item !== null;
            }));

            foreach ($contactItemsIdsToRemove as $contactItemId) {
                $this->connection->delete(
                    "contacts",
                    "contact_id = ? and item_id = ?",
                    [$contactId, $contactItemId]
                );
            }
        }

        foreach ($contacts as $contact) {
            $values = [
                "contact_id" => $contactId,
                "type"       => $contact["type"],
                "text"       => $contact["text"],
                "position"   => $contact["position"] ?? 0
            ];

            if (isset($contact["item_id"])) {
                $values["item_id"] = $contact["item_id"];

                $this->connection->update(
                    "contacts",
                    $values,
                    "contact_id = ? and item_id = ?",
                    [$contactId, $values["item_id"]]
                );

                continue;
            }

            $values["item_id"] = $this->getNewContactItemId();

            $this->connection->insert(
                "contacts",
                $values
            );
        }

        return $contactId;
    }

    private function getNewContactId(): int
    {
        $sql = "select max(contact_id) from contacts";
        $contactId = $this->connection->selInt($sql);

        if ($contactId === false) { // no contacts at all
            $contactId = 1;
        }

        return ++$contactId;
    }

    private function getNewContactItemId(): int
    {
        $sql = "select max(item_id)
                from contacts";
        $contactItemId = $this->connection->selInt($sql);

        if ($contactItemId === false) {
            $contactItemId = 1;
        } else {
            $contactItemId++;
        }

        return $contactItemId;
    }
}
