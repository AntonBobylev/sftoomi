<?php

namespace App\Controller;

use App\Repository\PatientRepository;
use DateTime;
use Doctrine\DBAL\Exception;
use Doctrine\ORM\EntityManagerInterface;
use RuntimeException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PatientsController extends AbstractController
{
    /**
     * @throws Exception
     */
    #[Route('/getPatients', name: 'get_patients')]
    public function getPatients(EntityManagerInterface $entityManager, Request $request): Response
    {
        $limit = $request->request->get("limit");
        $start = $request->request->get("start");
        $start = $limit * $start;

        $sql = "select id, last_name, first_name, middle_name, dob, phone
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

    /**
     * @throws Exception
     */
    #[Route('/getPatient', name: 'get_patient')]
    public function getPatient(EntityManagerInterface $entityManager, Request $request): Response
    {
        $id = $request->request->get("id");

        $sql = "select id, last_name, first_name, middle_name, dob, phone
                from patient
                where id = $id";
        $patient = $entityManager->getConnection()->fetchAssociative($sql);

        if (empty($patient)) {
            throw new RuntimeException("Patient not found");
        }

        return new JsonResponse([
            "data" => $patient
        ]);
    }

    /**
     * @throws Exception
     */
    #[Route('/savePatient', name: 'save_patient')]
    public function savePatient(EntityManagerInterface $entityManager, Request $request): Response
    {
        $dob = $request->request->get("dob");
        if (($dob = strtotime($dob)) !== false) {
            $dob = (new DateTime())->setTimestamp($dob)->format('Y-m-d');
        } else {
            $dob = null;
        }

        $id = $request->request->get("id");
        $values = [
            "id"          => $request->request->get("id"),
            "last_name"   => $request->request->get("last_name"),
            "first_name"  => $request->request->get("first_name"),
            "middle_name" => $request->request->get("middle_name"),
            "phone"       => $request->request->get("phone"),
            "dob"         => $dob
        ];

        if (isset($id)) { {
            $entityManager->getConnection()->update(
                "patient",
                $values,
                ["id" => $values["id"]]
            );
        }} else {
            $entityManager->getConnection()->insert(
                "patient",
                $values
            );

            $id = $entityManager->getConnection()->lastInsertId();
        }

        return new JsonResponse([
            "id" => $id
        ]);

    }
    #[Route('/removePatient', name: 'remove_patient')]
    public function removePatient(EntityManagerInterface $entityManager, PatientRepository $patientRepository, Request $request): Response
    {
        $ids = $request->request->get("ids");

        if (empty($ids)) {
            throw new RuntimeException("At least one id is required for removal operation");
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
