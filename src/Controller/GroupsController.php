<?php

namespace App\Controller;

use App\Class\Fetcher;
use App\Class\Model\GroupModel;
use App\Class\Model\PermissionModel;
use Doctrine\DBAL\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class GroupsController extends SftoomiController
{
    /**
     * @throws Exception
     */
    #[Route("/getGroups", name: "get_groups")]
    public function getGroups(Request $request): Response
    {
        $groupModel = new GroupModel($this->connection);
        $result = $groupModel->getAll(
            $request->request->get("start"),
            $request->request->get("limit")
        );

        foreach ($result["data"] as &$row) {
            $row["permissions"] = $this->getGroupPermissions($row["id"]);
        }
        unset($row);

        return new JsonResponse([
            "data"  => $result["data"],
            "total" => $result["total"]
        ]);
    }

    #[Route("/getGroup", name: "get_group")]
    public function getGroup(Request $request): Response
    {
        $id = Fetcher::int($request->request->get("id"));
        $data = [];

        if (isset($id)) {
            $groupModel = new GroupModel($this->connection);
            $data = $groupModel->get($id);

            if (!empty($data)) {
                $data["permissions"] = $this->getGroupPermissions($id);
            }
        }

        return new JsonResponse([
            "data"  => $data,
            "lists" => [
                "permissions" => new PermissionModel($this->connection)->getAll()["data"]
            ]
        ]);
    }

    #[Route("/saveGroup", name: "save_group")]
    public function saveGroup(Request $request): Response
    {
        $values = [
            "id"   => Fetcher::int($request->request->get("id")),
            "name" => Fetcher::trim($request->request->get("group_name"))
        ];

        $this->assertAllRequiredFieldsSet(["id", "name"], $values);

        $this->connection->insupd(
            "groups",
            $values,
            "id = ?",
            [$values["id"]]
        );

        $groupId = $values["id"];
        if (empty($groupId)) {
            $groupId = $this->connection->getLastInsertId();
        }

        $groupPermissionsIds = Fetcher::intArray($request->request->get("groups_permissions_ids"), []);
        $this->connection->delete(
            "groups_permissions",
            "group_id = ?",
            [$groupId]
        );

        foreach ($groupPermissionsIds as $permissionsId) {
            $this->connection->insert(
                "groups_permissions",
                [
                    "group_id"      => $groupId,
                    "permission_id" => $permissionsId
                ]
            );
        }

        return new JsonResponse([
            "id" => $groupId
        ]);
    }

    private function getGroupPermissions(int $groupId): array
    {
        $sql = "select p.name, p.description, p.id
                from groups_permissions gp
                    left join permissions p on p.id = gp.permission_id
                where gp.group_id = ?";

        return $this->connection->fetchAll($sql, [$groupId]);
    }
}
