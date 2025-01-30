<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PatientsController
{
    #[Route('/patients', name: 'get_patients')]
    public function getPatients(): Response
    {
        return new JsonResponse([
            "test" => "test"
        ]);
    }
}
