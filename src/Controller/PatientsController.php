<?php

namespace App\Controller;

use App\Class\Fetcher;
use App\Repository\PatientRepository;
use Doctrine\DBAL\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class PatientsController extends AppCrudController
{
    protected string $baseTable = "patient";

    /**
     * @throws Exception
     */
    #[Route("/getPatients", name: "get_patients")]
    public function getPatients(Request $request): Response
    {
        $patients = $this->getList(
            $request,
            ["id", "last_name", "first_name", "middle_name", "dob", "phone"]
        );

        return new JsonResponse([
            "data"  => $patients["data"],
            "total" => $patients["total"]
        ]);
    }

    /**
     * @throws Exception
     */
    #[Route("/getPatient", name: "get_patient")]
    public function getPatient(Request $request): Response
    {
        return new JsonResponse([
            "data" => $this->getOne($request, ["id", "last_name", "first_name", "middle_name", "dob", "phone"])
        ]);
    }

    /**
     * @throws Exception
     */
    #[Route("/savePatient", name: "save_patient")]
    public function savePatient(Request $request): Response
    {
        $values = [
            "id"          => Fetcher::int($request->request->get("id")),
            "last_name"   => Fetcher::trim($request->request->get("last_name")),
            "first_name"  => Fetcher::trim($request->request->get("first_name")),
            "middle_name" => Fetcher::trim($request->request->get("middle_name")),
            "phone"       => Fetcher::trim($request->request->get("phone")),
            "dob"         => Fetcher::date($request->request->get("dob"))
        ];

        $id = $this->save($request, $values)["id"];

        return new JsonResponse([
            "id" => $id
        ]);

    }

    #[Route("/removePatient", name: "remove_patient")]
    public function removePatient(PatientRepository $patientRepository, Request $request): Response
    {
        $this->remove($patientRepository, $request);

        return new JsonResponse([]);
    }
}
