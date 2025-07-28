<?php

/** @noinspection PhpIllegalPsrClassPathInspection */

use App\Class\Constants;

class App
{
    public static function logDump(mixed $data, string $filename = "dumps"): void
    {
        ob_start();
        var_dump($data);
        $data = ob_get_clean();

        $data = sprintf(
            "=== %s %s\n%s%s\n\n",
            date("Y-m-d H:i:s T"),
            str_repeat("=", 92),
            $data,
            str_repeat("=", 120)
        );

        $file = Constants::LOG_DIRECTORY . $filename;
        file_put_contents($file, $data, FILE_APPEND);
    }
}
