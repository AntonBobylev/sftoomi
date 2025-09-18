<?php

namespace App\Controller;

use App\Class\TemplateManager;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class TemplateController extends SftoomiController
{
    #[Route("/getTemplate", name: "get_template")]
    public function getTemplate(Request $request, Filesystem $filesystem): Response
    {
        return new JsonResponse([
            "data" => []
        ]);
    }

    #[Route("/loadTemplate", name: "load_template")]
    public function loadTemplate(Request $request, Filesystem $filesystem): Response
    {
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

    #[Route('/getTemplates', name: 'get_templates')]
    public function getTemplates(): Response
    {
        return new JsonResponse([
            "data"  => [],
            "total" => []
        ]);
    }

    #[Route('/saveTemplate', name: 'save_template')]
    public function saveTemplate(): Response
    {
        return new JsonResponse([
            "data"  => [],
            "total" => []
        ]);
    }

    #[Route('/removeTemplate', name: 'remove_template')]
    public function removeTemplate(): Response
    {
        return new JsonResponse([
            "data"  => [],
            "total" => []
        ]);
    }
}
