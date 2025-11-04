<?php

namespace App\Controller;

use App\Class\Fetcher;
use App\Class\Model\StudyModel;
use Doctrine\DBAL\Exception;
use InvalidArgumentException;
use RuntimeException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class StudiesController extends SftoomiController
{
    #[Route("/getStudies", name: "get_studies")]
    public function getStudies(Request $request): Response
    {
        $studyModel = new StudyModel($this->connection);
        $result = $studyModel->getAll(
            $request->request->get("start"),
            $request->request->get("limit")
        );

        return new JsonResponse([
            "data"  => $result["data"],
            "total" => $result["total"]
        ]);
    }

    /**
     * @throws Exception
     */
    #[Route("/getStudy", name: "get_study")]
    public function getStudy(Request $request): Response
    {
        $studyId = $request->request->get("id");

        $study = [];
        if (!empty($studyId)) {
            $sql = "select id, full_name, short_name
                    from study
                    where id = $studyId";
            $study = $this->connection->fetchAssociative($sql);

            $sql = "select cpts.id as value, concat('(', cpts.code, '): ', cpts.short_name) as caption
                    from studies_cpts scpts
                        left join cpts on cpts.id = scpts.cpt_id
                    where scpts.study_id = $studyId";
            $study["study_cpts"] = $this->connection->fetchAllAssociative($sql);
        }

        return new JsonResponse([
            "data"  => $study
        ]);
    }

    /**
     * @throws Exception
     */
    #[Route("/saveStudy", name: "save_study")]
    public function saveStudy(Request $request): Response
    {
        $cptCodesIds = Fetcher::intArray($request->request->get("study_cpts"));
        if (empty($cptCodesIds)) {
            throw new InvalidArgumentException("Study must have at least one cpt code");
        }

        $values = [
            "id"          => Fetcher::int($request->request->get("id")),
            "short_name"  => Fetcher::trim($request->request->get("short_name")),
            "full_name"   => Fetcher::trim($request->request->get("full_name"))
        ];

        try {
            $this->connection->beginTransaction();
            $id = $this->save($request, $values)["id"];

            $this->connection->delete(
                "studies_cpts",
                ["study_id" => $id]
            );

            foreach ($cptCodesIds as $cptCodeId) {
                $this->connection->insert(
                    "studies_cpts",
                    ["study_id" => $id, "cpt_id" => $cptCodeId]
                );
            }
        } catch (\Exception $e) {
            $this->connection->rollback();

            throw new RuntimeException("Failed to save study due to error: " . $e->getMessage());
        }

        $this->connection->commit();

        return new JsonResponse([
            "id" => $id
        ]);
    }

    #[Route("/removeStudy", name: "remove_study")]
    public function removeStudy(Request $request): Response
    {
        $this->remove($request);

        return new JsonResponse([]);
    }

    /**
     * @throws Exception
     */
    #[Route("/lookupCpt", name: "lookup_cpt")]
    public function lookupCpt(Request $request): Response
    {
        $query = $request->request->get("query");
        if (empty($query)) {
            return new JsonResponse([]);
        }

        $excludeIds = $request->request->get("exclude_ids");
        $sql = "select id as value, concat('(', code, '): ', short_name) as caption
                from cpts
                where (short_name like '%$query%' or full_name like '%$query%' or code like '%$query%')";
        if (!empty($excludeIds)) {
            $sql .= " and id not in ($excludeIds)";
        }

        $cpts = $this->connection->fetchAllAssociative($sql);

        return new JsonResponse([
            "data"  => $cpts
        ]);
    }
}
