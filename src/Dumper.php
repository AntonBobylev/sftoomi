<?php

namespace App;

final class Dumper
{
    public static function log($data, $filename = "dumps"): void
    {
        ob_start();
        var_dump($data);
        $data = ob_get_clean();
        $data = "== " . date("Y-m-d H:i:s T") . " " . str_repeat("=", 93) . "\n"
            . $data
            . str_repeat("=", 120) . "\n\n";

        $file = sprintf("%s/../var/log/%s", __DIR__, $filename);
        file_put_contents($file, $data, FILE_APPEND);
    }
}
