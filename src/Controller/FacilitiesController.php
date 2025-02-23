<?php

namespace App\Controller;

use App\Class\Fetcher;
use App\Repository\FacilityRepository;
use Doctrine\DBAL\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class FacilitiesController extends AppCrudController
{
    protected string $baseTable = "facility";

    /**
     * @throws Exception
     */
    #[Route("/getFacilities", name: "get_facilities")]
    public function getFacilities(Request $request): Response
    {
        $facilities = $this->getList(
            $request,
            ["id", "short_name", "full_name"]
        );

        return new JsonResponse([
            "data"  => $facilities["data"],
            "total" => $facilities["total"]
        ]);
    }

    /**
     * @throws Exception
     */
    #[Route("/getFacility", name: "get_facility")]
    public function getFacility(Request $request): Response
    {
        return new JsonResponse([
            "data" => $this->getOne($request, ["id", "short_name", "full_name"])
        ]);
    }

    /**
     * @throws Exception
     */
    #[Route("/saveFacility", name: "save_facility")]
    public function saveFacility(Request $request): Response
    {
        $values = [
            "id"         => Fetcher::int($request->request->get("id")),
            "short_name" => Fetcher::trim($request->request->get("short_name")),
            "full_name"  => Fetcher::trim($request->request->get("full_name"))
        ];

        $id = $this->save($request, $values)["id"];

        return new JsonResponse([
            "id" => $id
        ]);
    }

    #[Route("/removeFacility", name: "remove_facility")]
    public function removeFacility(FacilityRepository $facilityRepository, Request $request): Response
    {
        $this->remove($facilityRepository, $request);

        return new JsonResponse([]);
    }
}
