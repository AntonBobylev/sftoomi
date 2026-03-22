<?php

namespace App\Class\StudyDraft;

readonly class DTO
{
    public function __construct(
        public string $patient_name,
        public string $examination_id,
        public string $exam_id,
        public string $study_short_name,
        public string $doctor_name,
    ) {}

    public function toArray(): array
    {
        return (array) $this;
    }
}
