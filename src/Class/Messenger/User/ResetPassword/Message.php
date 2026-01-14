<?php

namespace App\Class\Messenger\User\ResetPassword;

readonly class Message
{
    public function __construct(
        private string $recipient,
        private string $password,
        private int $userId
    )
    {
    }

    public function getRecipient(): string
    {
        return $this->recipient;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function getUserId(): int
    {
        return $this->userId;
    }
}
