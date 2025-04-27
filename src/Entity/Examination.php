<?php

namespace App\Entity;

use App\Repository\ExaminationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ExaminationRepository::class)]
class Examination
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $patient_id = null;

    #[ORM\Column]
    private ?int $facility_id = null;

    #[ORM\Column(nullable: true)]
    private ?int $doctor_id = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPatientId(): ?int
    {
        return $this->patient_id;
    }

    public function setPatientId(int $patient_id): static
    {
        $this->patient_id = $patient_id;

        return $this;
    }

    public function getFacilityId(): ?int
    {
        return $this->facility_id;
    }

    public function setFacilityId(int $facility_id): static
    {
        $this->facility_id = $facility_id;

        return $this;
    }

    public function getDoctorId(): ?int
    {
        return $this->doctor_id;
    }

    public function setDoctorId(?int $doctor_id): static
    {
        $this->doctor_id = $doctor_id;

        return $this;
    }
}
