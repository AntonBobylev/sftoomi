<?php

namespace App\Controller;

use App\Class\Fetcher;
use App\Repository\DoctorRepository;
use Doctrine\DBAL\Exception;
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

        $filePath = sprintf("%s%s", \App::getVars()->get("templates_dir"), $templateName);
        if (!$filesystem->exists($filePath)) {
            throw new \RuntimeException("File doesn't exist by the path: \"$filePath\"");
        }

        return new JsonResponse([
            "data"  => [
                "template_code" => $filesystem->readFile($filePath)
            ]
        ]);
    }
}
