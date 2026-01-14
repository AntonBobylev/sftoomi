<?php

namespace App\Class\Messenger\User\ResetPassword;

use App\Class\Core\DB\Connection as DBConnection;
use App\Class\Messenger\SftoomiHandler;
use App\Class\TemplateManager;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\DBAL\Exception;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use App\Class\Mailer;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsMessageHandler]
readonly class Handler extends SftoomiHandler
{
    public function __construct(
        DBConnection $connection,
        private Mailer $mailer,
        private TemplateManager $templateManager,
        private UserPasswordHasherInterface $passwordHasher,
        private UserRepository $userRepository,
    )
    {
        parent::__construct($connection);
    }

    /**
     * @param Message $message
     *
     * @return void
     *
     * @throws \Exception
     * @throws Exception
     */
    public function __invoke(Message $message): void
    {
        $user = $this->getUser($message->getUserId());

        $templateContent = $this->templateManager->getTemplate("email/user-new-password.html");
        $mailContent = $this->templateManager->apply($templateContent, [
            "password" => $message->getPassword()
        ]);

        $this->mailer->applyTemplate($mailContent);
        $this->mailer->addAddresses([$message->getRecipient()]);

        $this->mailer->send();

        $password = $this->passwordHasher->hashPassword(new User(), $message->getPassword());

        $this->connection->update(
            "users",
            [
                "password"                 => $password,
                "force_to_change_password" => 1
            ],
            "id = :id",
            ["id" => $user->getId()]
        );
    }

    /**
     * @throws \Exception
     */
    private function getUser(int $userId): User
    {
        $user = $this->userRepository->findOneBy(["id" => $userId]);
        if (!$user instanceof User) {
            throw new \Exception("User not found");
        }

        return $user;
    }
}
