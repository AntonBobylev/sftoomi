<?php

namespace App\EventSubscriber;

use App\Class\Constants;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class LocaleSubscriber implements EventSubscriberInterface
{
    private string $defaultLocale = "en";

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();

        $locale = $request->cookies->get(Constants::COOKIES_NAMES["LOCALE"]);

        if (!$locale || !in_array($locale, Constants::AVAILABLE_LOCALES, true)) {
            $locale = $this->defaultLocale;
        }

        $request->setLocale($locale);
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => [['onKernelRequest', 20]]
        ];
    }
}
