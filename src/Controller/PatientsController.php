<?php

namespace App\Controller;

use App\DataMappers\PatientDM;
use App\Entity\Patient;
use App\Repository\PatientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
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

    #[Route('/getPatient', name: 'get_patient')]
    public function getPatient(PatientRepository $patientRepository, Request $request): Response
    {
        $id = $request->request->get("id");
        $patients = $patientRepository->findBy(["id" => $id]);
        if (empty($patients)) {
            throw new \RuntimeException("Patient not found");
        }

        return new JsonResponse([
            "data" => (new PatientDM)->entityToData($patients[0])
        ]);
    }

    #[Route('/savePatient', name: 'save_patient')]
    public function savePatient(EntityManagerInterface $entityManager, PatientRepository $patientRepository, Request $request): Response
    {
        $id = $request->request->get("id");

        if (empty($id)) {
            // it means this is the new patient
            $patient = new Patient();
        } else {
            $patients = $patientRepository->findBy(["id" => $id]);

            $patient = $patients[0];
            if (empty($patient)) {
                $this->createNotFoundException(sprintf("Patient with ID %s not found", $id));
            }
        }

        $patient = (new PatientDM())->dataToEntity([
            "last_name"   => $request->request->get("last_name"),
            "first_name"  => $request->request->get("first_name"),
            "middle_name" => $request->request->get("middle_name"),
            "dob"         => (new \DateTime())->setTimestamp(strtotime($request->request->get("dob")))
        ], $patient);

        $entityManager->persist($patient);
        $entityManager->flush();

        return new JsonResponse([
            "id" => $patient->getId()
        ]);
    }
}
