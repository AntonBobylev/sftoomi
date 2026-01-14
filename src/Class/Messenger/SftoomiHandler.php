<?php

namespace App\Class\Messenger;

use App\Class\Core\DB\Connection as DBConnection;
use App\Class\Messenger\User\ResetPassword\Message;

abstract readonly class SftoomiHandler
{
    public function __construct(
        protected DBConnection $connection
    )
    {
    }

    public abstract function __invoke(Message $message): void;
}
