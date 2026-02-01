<?php

namespace App\Controller;

use App\Class\Fetcher;
use App\Class\Model\StudyModel;
use App\Class\Model\TemplateModel;
use App\Class\TemplateManager;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class TemplateController extends SftoomiController
{
    #[Route("/getTemplates", name: "get_templates")]
    public function getTemplates(Request $request): Response
    {
        $this->auth->requirePermission("REPORT_TEMPLATES_MODULE");

        $studyModel = new TemplateModel($this->connection);
        $result = $studyModel->getAll(
            $request->request->get("start"),
            $request->request->get("limit")
        );

        return new JsonResponse([
            "data"  => $result["data"],
            "total" => $result["total"]
        ]);
    }

    #[Route("/getTemplate", name: "get_template")]
    public function getTemplate(Request $request, TemplateManager $templateManager): Response
    {
        $this->auth->requireAnyPermission(["REPORT_TEMPLATES_MODULE::ADD", "REPORT_TEMPLATES_MODULE::EDIT"]);

        $data = [];
        $templateId = Fetcher::int($request->request->get("id"));
        if (!empty($templateId)) {
            $data = new TemplateModel($this->connection)->get($templateId);
        }

        return new JsonResponse([
            "data"  => $data,
            "lists" => [
                "studies"           => new StudyModel($this->connection)->getAll()["data"],
                "generic_templates" => $templateManager->getGenericTemplates()
            ]
        ]);
    }

    #[Route("/loadTemplateContent", name: "load_template_content")]
    public function loadTemplateContent(Request $request, Filesystem $filesystem): Response
    {
        $this->auth->requirePermission("REPORT_TEMPLATES_MODULE");

        $templateName = $request->request->get("template_name");
        if (empty($templateName)) {
            throw new \InvalidArgumentException("Template name cannot be empty");
        }

        $templateManager = new TemplateManager($filesystem);
        $templateCode = $templateManager->getTemplate($templateName, [], true);

        return new JsonResponse([
            "data" => [
                "template_code" => $templateCode
            ]
        ]);
    }

    #[Route("/saveTemplate", name: "save_template")]
    public function saveTemplate(Request $request): Response
    {
        $values = [
            "id"      => Fetcher::int($request->request->get("id")),
            "name"    => Fetcher::trim($request->request->get("template_name")),
            "content" => Fetcher::trim($request->request->get("template_content"))
        ];

        $this->auth->requirePermission(
            empty($values["id"])
                ? "REPORT_TEMPLATES_MODULE::ADD"
                : "REPORT_TEMPLATES_MODULE::EDIT"
        );

        $this->assertAllRequiredFieldsSet(["name"], $values);

        $this->connection->insupd(
            "template",
            $values,
            "id = ?",
            [$values["id"]]
        );

        $templateId = $values["id"];
        if (empty($templateId)) {
            $templateId = $this->connection->getLastInsertId();
        }

        $templateAllowedStudies = Fetcher::intArray($request->request->get("allowed_studies"), []);
        $this->connection->delete(
            "templates_studies",
            "template_id = ?",
            [$templateId]
        );

        foreach ($templateAllowedStudies as $studyId) {
            $this->connection->insert(
                "templates_studies",
                [
                    "template_id" => $templateId,
                    "study_id"    => $studyId
                ]
            );
        }

        return new JsonResponse([
            "id" => $templateId
        ]);
    }

    #[Route("/removeTemplate", name: "remove_template")]
    public function removeTemplate(): Response
    {
        return new JsonResponse([
            "data"  => [],
            "total" => []
        ]);
    }
}
