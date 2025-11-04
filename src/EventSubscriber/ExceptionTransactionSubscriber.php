<?php
namespace App\EventSubscriber;

use Doctrine\DBAL\Connection as DBALConnection;
use Doctrine\DBAL\Exception;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class ExceptionTransactionSubscriber implements EventSubscriberInterface
{
    private bool $transactionStarted = false;

    public function __construct(private readonly DBALConnection $connection)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::CONTROLLER => ["onController", 10],
            KernelEvents::RESPONSE   => ["onResponse",  -10],
            KernelEvents::EXCEPTION  => ["onException",  10]
        ];
    }

    /**
     * @throws Exception
     */
    public function onController(): void
    {
        $this->connection->beginTransaction();
        $this->transactionStarted = true;
        \App::logDump("here");
    }

    /**
     * @throws Exception
     */
    public function onResponse(ResponseEvent $event): void
    {
        if ($this->transactionStarted) {
            if ($event->getResponse()->getStatusCode() < 400) {
                $this->connection->commit();
            } else {
                $this->connection->rollback();
            }
            $this->transactionStarted = false;
        }
    }

    /**
     * @throws Exception
     */
    public function onException(): void
    {
        if ($this->transactionStarted) {
            $this->connection->rollback();
            $this->transactionStarted = false;
        }
    }
}
