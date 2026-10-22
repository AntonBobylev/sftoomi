<?php

namespace App\Class\FileReader;

class JsonFileReader extends AbstractFileReader
{
    public function read(string $filePath): array
    {
        $data = json_decode(parent::read($filePath), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \RuntimeException(json_last_error_msg());
        }

        return $data;
    }
}
