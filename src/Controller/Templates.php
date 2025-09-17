<?php

namespace App\Controller;

use App\Class\TemplateManager;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class Templates extends SftoomiController
{
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
}
