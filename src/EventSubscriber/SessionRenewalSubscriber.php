<?php

namespace App\EventSubscriber;

use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class SessionRenewalSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private Security $security
    ) {}

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => ['onKernelRequest', 7],
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();

        // Пропускаем не основные запросы и OPTIONS запросы
        if (!$event->isMainRequest() || $request->isMethod('OPTIONS')) {
            return;
        }

        // Пропускаем публичные маршруты
        $path = $request->getPathInfo();
        if (in_array($path, ['/login', '/register', '/check-auth'])) {
            return;
        }

        // Обновляем сессию только для аутентифицированных пользователей
        if ($this->security->getUser() && $request->hasSession()) {
            $session = $request->getSession();

            if ($session->isStarted()) {
                $session->migrate(true, 3600); // Обновляем сессию на 1 час
            }
        }
    }
}
