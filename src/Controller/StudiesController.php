<?php

namespace App\Controller;

use App\Class\EntityManipulator;
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
        $studyId = Fetcher::int($request->request->get("id"));

        $study = [];
        if (!empty($studyId)) {
            $studyModel = new StudyModel($this->connection);
            $study = $studyModel->get($studyId);

            $study["study_cpts"] = array_map(function ($row) {
                return [
                    "value" => $row["id"],
                    "caption" => sprintf(
                        "(%s): %s",
                        $row["code"],
                        $row["short_name"]
                    )
                ];
            }, $study["study_cpts"]);
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

        $this->connection->insupd(
            "study",
            $values,
            "id = ?",
            [$values["id"]]
        );

        $studyId = $values["id"];
        if (empty($studyId)) {
            $studyId = $this->connection->getLastInsertId();
        }

        $this->connection->delete(
            "studies_cpts",
            "study_id = ?",
            [$studyId]
        );

        foreach ($cptCodesIds as $cptCodeId) {
            $this->connection->insert(
                "studies_cpts",
                ["study_id" => $studyId, "cpt_id" => $cptCodeId]
            );
        }

        return new JsonResponse([
            "id" => $studyId
        ]);
    }

    #[Route("/removeStudy", name: "remove_study")]
    public function removeStudy(Request $request): Response
    {
        $ids = Fetcher::intArray($request->request->get("ids"));

        new EntityManipulator($this->connection)
            ->remove("study", $ids);

        return new JsonResponse([]);
    }

    /**
     * @throws Exception
     */
    #[Route("/lookupCpt", name: "lookup_cpt")]
    public function lookupCpt(Request $request): Response
    {
        $query = Fetcher::trim($request->request->get("query"));
        if (empty($query)) {
            return new JsonResponse([]);
        }

        $filters = [];

        $excludeIds = Fetcher::intArray($request->request->get("exclude_ids"));
        if (!empty($excludeIds)) {
            $filters[] = $this->connection->subst("id not in ?", [$excludeIds]);
        }

        $filters = empty($filters) ? "true" : implode(" and ", $filters);

        $sql = "select id as value, concat('(', code, '): ', short_name) as caption
                from cpts
                where (short_name like '%$query%' or full_name like '%$query%' or code like '%$query%')
                    and $filters";
        $cpts = $this->connection->fetchAll($sql);

        return new JsonResponse([
            "data"  => $cpts
        ]);
    }
}
