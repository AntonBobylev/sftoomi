<?php

use Symfony\Component\DependencyInjection\ContainerInterface;

final class App
{
    /**
     * @var ContainerInterface
     */
    private static $container;

    public static function logDump($data, $filename = "dumps"): void
    {
        ob_start();
        var_dump($data);
        $data = ob_get_clean();
        $data = "== " . date("Y-m-d H:i:s T") . " " . str_repeat("=", 93) . "\n"
            . $data
            . str_repeat("=", 120) . "\n\n";

        self::appendToFile($filename, $data);
    }

    private static function appendToFile($filename, $data): void
    {
        $file = self::getLogDir() . "/" . $filename;

        file_put_contents($file, $data, FILE_APPEND);
    }

    private static function getLogDir(): string
    {
        return __DIR__ . "/../var/log";
    }

    public static function getContainer(): ContainerInterface
    {
        if (!isset(self::$container)) {
            throw new \Exception("Container is not initialized yet");
        }

        return self::$container;
    }
}
