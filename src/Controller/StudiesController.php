<?php

namespace App\Controller;

use App\Class\Fetcher;
use App\Repository\StudyRepository;
use Doctrine\DBAL\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class StudiesController extends AppCrudController
{
    protected string $baseTable = "study";

    /**
     * @throws Exception
     */
    #[Route("/getStudies", name: "get_studies")]
    public function getStudies(Request $request): Response
    {
        $studies = $this->getList(
            $request,
            ["id", "short_name", "full_name",]
        );

        $data = $studies["data"];
        foreach ($data as &$row) {
            $sql = "select cpts.id, cpts.code, cpts.short_name, cpts.full_name
                    from studies_cpts sc
                        left join cpts on cpts.id = sc.cpt_id
                    where sc.study_id = {$row["id"]}";
            $row["study_cpts"] = $this->connection->fetchAllAssociative($sql);
        }
        unset($row);

        return new JsonResponse([
            "data"  => $data,
            "total" => $studies["total"]
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
            $sql = "select st.id, st.full_name, st.short_name,
                        group_concat(cpts.id) as study_cpts
                    from study st
                        left join studies_cpts scpts on scpts.study_id = st.id
                        left join cpts on cpt_id = scpts.cpt_id
                    where st.id = $studyId";
            $study = $this->connection->fetchAssociative($sql);

            if (!empty($study["study_cpts"])) {
                $sql = "select id, code as name, full_name as tooltip
                        from cpts
                        where id in {$study["study_cpts"]}}";
                $study["study_cpts"] = $this->connection->fetchAllAssociative($sql);
            }
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
        $values = [
            "id"          => Fetcher::int($request->request->get("id")),
            "short_name"  => Fetcher::trim($request->request->get("short_name")),
            "full_name"   => Fetcher::trim($request->request->get("full_name"))
        ];

        try {
            $this->connection->beginTransaction();
            $id = $this->save($request, $values)["id"];
        } catch (\Exception $e) {
            $this->connection->rollback();

            throw new \RuntimeException("Failed to save study due to error: " . $e->getMessage());
        }

        $this->connection->commit();

        return new JsonResponse([
            "id" => $id
        ]);
    }

    /**
     * @throws Exception
     */
    #[Route("/removeStudy", name: "remove_study")]
    public function removeStudy(StudyRepository $studyRepository, Request $request): Response
    {
        try {
            $this->connection->beginTransaction();

            $this->remove($studyRepository, $request);
        } catch (\Exception $e) {
            $this->connection->rollback();

            throw new \RuntimeException("Failed to remove study due to error: " . $e->getMessage());
        }

        $this->connection->commit();

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
        $sql = "select id, code as name, full_name as tooltip
                from cpts
                where (short_name like '%{$query}%' or full_name like '%{$query}%' or code like '%{$query}%')";
        if (!empty($excludeIds)) {
            $sql .= " and id not in ($excludeIds)";
        }

        $cpts = $this->connection->fetchAllAssociative($sql);

        return new JsonResponse([
            "data"  => $cpts
        ]);
    }
}
