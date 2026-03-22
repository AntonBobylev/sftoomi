<?php

namespace App\Controller;

use App\Class\Fetcher;
use App\Class\StudyDraft\Manager;
use App\Class\TemplateManager;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class DraftViewer extends SftoomiController
{
    #[Route("/getDraftViewerData", name: "get_draft_viewer_data")]
    public function getDraftViewerData(Request $request): Response
    {
        $this->auth->requirePermission("EXAMINATIONS_MODULE::EDIT_DRAFT");

        $examId = Fetcher::int($request->request->get("exam_id"));
        if (empty($examId)) {
            throw new \InvalidArgumentException("Exam ID required");
        }

        $sql = "select study_id
                from examinations_studies
                where exam_id = ?";
        $studyId = $this->connection->selInt($sql, [$examId]);

        $sql = "select t.id, t.name
                from template t
                    left join templates_studies ts on t.id = ts.template_id
                where ts.study_id = ?
                   or ts.template_id is null";
        $templates = $this->connection->fetchAll($sql, [$studyId]);

        return new JsonResponse([
            "data"  => [
                "last_edited_draft_template_id" => 1 // TODO: implement
            ],
            "lists" => [
                "templates" => $templates
            ]
        ]);
    }
    #[Route("/getDraftViewerTemplateData", name: "get_draft_viewer_template_data")]
    public function getDraftViewerTemplateData(Request $request, TemplateManager $templateManager, Manager $studyDraftManager): Response
    {
        $this->auth->requirePermission("EXAMINATIONS_MODULE::EDIT_DRAFT");

        $templateId = Fetcher::int($request->request->get("template_id"));
        if (empty($templateId)) {
            throw new \InvalidArgumentException("Template ID required");
        }

        $examId = Fetcher::int($request->request->get("exam_id"));
        if (empty($examId)) {
            throw new \InvalidArgumentException("Exam ID required");
        }

        $sql = "select content
                from template
                where id = ?";
        $templateContent = $this->connection->selString($sql, [$templateId]);

        if (empty($templateContent)) {
            throw new \InvalidArgumentException("Template content not found");
        }

        $data = $studyDraftManager->getStudyDraftData($examId);

        $templateContent = $templateManager->apply($templateContent, $data);

        return new JsonResponse([
            "data" => [
                "template_content" => $templateContent
            ]
        ]);
    }
}
