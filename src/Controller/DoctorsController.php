<?php

namespace App\Controller;

use App\Class\Fetcher;
use App\Repository\FacilityRepository;
use Doctrine\DBAL\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class DoctorsController extends AppCrudController
{
    protected string $baseTable = "doctor";

    /**
     * @throws Exception
     */
    #[Route("/getDoctors", name: "get_doctors")]
    public function getDoctors(Request $request): Response
    {
        $doctors = $this->getList(
            $request,
            ["id", "last_name", "first_name", "middle_name"]
        );

        return new JsonResponse([
            "data"  => $doctors["data"],
            "total" => $doctors["total"]
        ]);
    }

    /**
     * @throws Exception
     */
    #[Route("/getDoctor", name: "get_doctor")]
    public function getDoctor(Request $request): Response
    {
        return new JsonResponse([
            "data" => $this->getOne($request, ["id", "last_name", "first_name", "middle_name"])
        ]);
    }
}
