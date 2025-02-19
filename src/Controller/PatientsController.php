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
    public function getPatients(EntityManagerInterface $entityManager, Request $request): Response
    {
        $limit = $request->request->get("limit");
        $start = $request->request->get("start");
        $start = $limit * $start;

        $sql = "select id, last_name, first_name, middle_name, dob
                from patient
                limit $start, $limit";
        $patients = $entityManager->getConnection()->fetchAllAssociative($sql);

        $sql = "select count(*) from patient";
        $total = $entityManager->getConnection()->fetchOne($sql);

        return new JsonResponse([
            "data"  => $patients,
            "total" => $total
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
                throw $this->createNotFoundException(sprintf("Patient with ID %s not found", $id));
            }
        }

        $dob = $request->request->get("dob");
        if (($dob = strtotime($dob)) !== false) {
            $dob = (new \DateTime())->setTimestamp($dob);
        } else {
            $dob = null;
        }

        $patient = (new PatientDM())->dataToEntity([
            "last_name"   => $request->request->get("last_name"),
            "first_name"  => $request->request->get("first_name"),
            "middle_name" => $request->request->get("middle_name"),
            "dob"         => $dob
        ], $patient);

        $entityManager->persist($patient);
        $entityManager->flush();

        return new JsonResponse([
            "id" => $patient->getId()
        ]);

    }
    #[Route('/removePatient', name: 'remove_patient')]
    public function removePatient(EntityManagerInterface $entityManager, PatientRepository $patientRepository, Request $request): Response
    {
        $ids = $request->request->get("ids");

        if (empty($ids)) {
            throw new \RuntimeException("At least one id is required for removal operation");
        }

        $ids = explode(",", $ids);

        $patients = $patientRepository->findBy(["id" => $ids]);
        foreach ($patients as $patient) {
            $entityManager->remove($patient);
        }

        $entityManager->flush();

        return new Response();
    }
}
