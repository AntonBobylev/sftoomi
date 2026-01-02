<?php

namespace App\EventListener;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class ExceptionListener
{
    private string $projectDir;

    public function __construct(string $projectDir)
    {
        $this->projectDir = realpath($projectDir) . DIRECTORY_SEPARATOR;
    }

    /**
     * Controls how data returns to the client when exception thrown
     *
     * @noinspection PhpUnused
     */
    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        $response = new JsonResponse([
            "message" => $exception->getMessage(),
            "code"    => $exception->getCode(),
            "trace"   => $this->getFormattedTrace($exception)
        ]);

        if ($exception instanceof HttpExceptionInterface) {
            $response->setStatusCode($exception->getStatusCode());
            $response->headers->replace($exception->getHeaders());
        } else {
            $response->setStatusCode(Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $event->setResponse($response);
    }

    private function getFormattedTrace(\Throwable $exception): string
    {
        $trace = $exception->getTrace();
        $formattedTrace = [];

        foreach ($trace as $step) {
            if (isset($step["file"])) {
                if (!str_contains($step["file"], $this->projectDir . "src/")) {
                    continue;
                }

                $file = str_replace($this->projectDir, "", $step["file"]);
                $line = $step["line"] ?? "?";

                $class = $step["class"] ?? "";
                $type = $step["type"] ?? "";
                $function = $step["function"] ?? "";
                $args = [];
                if (isset($step["args"])) {
                    foreach ($step["args"] as $arg) {
                        $args[] = $this->formatArg($arg);
                    }
                }
                $argsString = implode(", ", $args);

                $formattedTrace[] = sprintf("#%s %s(%s): %s%s%s(%s)",
                    count($formattedTrace),
                    $file,
                    $line,
                    $class,
                    $type,
                    $function,
                    $argsString
                );
            }
        }

        $firstLine = sprintf("An exception thrown: %s (%s)",
            str_replace($this->projectDir, "", $exception->getFile()),
            $exception->getLine()
        );
        array_unshift($formattedTrace, $firstLine);

        return implode("\n", $formattedTrace);
    }

    private function formatArg($arg): string
    {
        if (is_object($arg)) {
            return "Object(" . get_class($arg) . ")";
        }

        if (is_array($arg)) {
            return "Array";
        }

        if (is_string($arg)) {
            return "\"" . (mb_strlen($arg) > 20 ? mb_substr($arg, 0, 17) . "..." : $arg) . "\"";
        }

        if (is_bool($arg)) {
            return $arg ? "true" : "false";
        }

        if (is_null($arg)) {
            return "null";
        }

        return (string)$arg;
    }
}
