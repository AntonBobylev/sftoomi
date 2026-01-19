<?php

namespace App\Controller;

use App\Class\Core\DB\Connection as DBConnection;
use App\Class\Security\Auth;
use InvalidArgumentException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

abstract class SftoomiController extends AbstractController
{
    public function __construct(
        protected readonly DBConnection $connection,
        protected readonly Auth $auth
    )
    {
    }

    protected function assertAllRequiredFieldsSet(array $requiredFields, array $values): void
    {
        if (empty($requiredFields)) {
            return;
        }

        if (empty($values)) {
            throw new InvalidArgumentException(sprintf(
                "Required fields for the operation: %s",
                implode(", ", $requiredFields)
            ));
        }

        foreach ($requiredFields as $field) {
            if (empty($values[$field])) {
                throw new InvalidArgumentException(sprintf(
                    "Field %s is required",
                    $field
                ));
            }
        }
    }
}
