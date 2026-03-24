<?php

namespace App\Class\StudyDraft;

readonly class DTO
{
    public function __construct(
        public string $patient_name,
        public string $patient_dob,
        public string $patient_age,
        public string $patient_gender,
        public string $exam_id,
        public string $examination_date,
        public string $study_full_name,
        public string $doctor_full_name,
        public string $facility_full_name
    ) {}

    public function toArray(): array
    {
        return (array) $this;
    }
}
