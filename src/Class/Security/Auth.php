<?php

namespace App\Class\Security;

use App\Class\Core\DB\Connection as DBConnection;
use App\Service\SessionManager;

class Auth
{
    private const string COOKIE_SESSION = "SFTOOMI_SESSION";

    private readonly SessionManager $sessionManager;

    public function __construct(
        private readonly DBConnection $connection
    )
    {
        $this->sessionManager = new SessionManager($this->connection);
    }

    public function requirePermission(string $permissionName): void
    {
        if (empty($permissionName) || $permissionName === "*") {
            return;
        }

        $userPermissions = $this->getUserPermissions();
        if (empty($userPermissions) || !in_array($permissionName, $userPermissions)) {
            throw new \RuntimeException("This operation is not allowed");
        }
    }

    public function requireAnyPermission(array $permissionsNames): void
    {
        if (empty($permissionsNames) || in_array("*", $permissionsNames)) {
            return;
        }

        $userPermissions = $this->getUserPermissions();
        $hasPermission = !empty(array_intersect($permissionsNames, $userPermissions));
        if (empty($hasPermission)) {
            throw new \RuntimeException("This operation is not allowed");
        }
    }

    private function getUserPermissions(): array
    {
        $userId = $this->getCurrentUserId();
        if (empty($userId)) {
            return [];
        }

        $sql = "select group_id
                from users_groups
                where user_id = ?";
        $userGroupsIds = $this->connection->fetchCol($sql, [$userId]);
        if (empty($userGroupsIds)) {
            return [];
        }

        $sql = "select distinct p.name
                from groups_permissions gp
                    left join permissions p on p.id = gp.permission_id
                where gp.group_id in ?";

        return $this->connection->fetchCol($sql, [$userGroupsIds]);
    }

    private function getCurrentUserId(): int | null
    {
        $userSessionId = $this->getCurrentUserSession();
        if (!isset($userSessionId)) {
            return null;
        }

        $sessionData = $this->sessionManager->validateSession($userSessionId);
        if (empty($sessionData)) {
            return null;
        }

        return $sessionData["id"];
    }

    private function getCurrentUserSession(): ?string
    {
        return $_COOKIE[self::COOKIE_SESSION];
    }
}
