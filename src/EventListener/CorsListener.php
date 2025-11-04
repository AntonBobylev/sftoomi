<?php

namespace App\EventListener;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ResponseEvent;

class CorsListener
{
    public function onKernelResponse(ResponseEvent $event)
    {
        $request = $event->getRequest();
        $response = $event->getResponse();

        if ($request->getMethod() === "OPTIONS") {
            $response->setStatusCode(Response::HTTP_OK);
        }

        if (empty($_ENV["FRONT_URL"])) {
            throw new \RuntimeException("FRONT_URL environment variable is not defined");
        }

        $response->headers->set("Access-Control-Allow-Origin", $_ENV["FRONT_URL"]);
        $response->headers->set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        $response->headers->set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-session-id");
        $response->headers->set("Access-Control-Expose-Headers", "x-session-id");
        $response->headers->set("Access-Control-Allow-Credentials", "true");
        $response->headers->set("Access-Control-Max-Age", "86400");
    }
}
