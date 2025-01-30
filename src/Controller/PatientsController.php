<?php

namespace App\Controller;

use App\DataMappers\PatientDM;
use App\Repository\PatientRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PatientsController extends AbstractController
{
    #[Route('/getPatients', name: 'get_patients')]
    public function getPatients(PatientRepository $patientRepository): Response
    {
        $patientsEntities = $patientRepository->findAll();

        $patients = [];
        foreach ($patientsEntities as $patientEntity) {
            $patients[] = (new PatientDM)->entityToData($patientEntity);
        }

        return new JsonResponse([
            "data" => $patients
        ]);
    }
}
