<?php

/** @noinspection PhpIllegalPsrClassPathInspection */
final class App
{
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
        $file = __DIR__ . "/../var/log/" . $filename;

        file_put_contents($file, $data, FILE_APPEND);
    }
}
