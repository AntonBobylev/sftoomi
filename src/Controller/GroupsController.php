<?php

namespace App\Controller;

use App\Class\Model\GroupModel;
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
            $sql = "select p.name, p.description, p.id
                    from groups_permissions gp
                        left join permissions p on p.id = gp.permission_id
                    where gp.group_id = ?";
            $row["permissions"] = $this->connection->fetchAll($sql, [$row["id"]]);
        }
        unset($row);

        return new JsonResponse([
            "data"  => $result["data"],
            "total" => $result["total"]
        ]);
    }
}
