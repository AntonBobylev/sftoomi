<?php

namespace App\Class\FileReader;

use App\Filesystem;

final class FileReaderFactory
{
    public static function build(string $className, Filesystem $filesystem): FileReaderInterface
    {
        return match ($className) {
            PlainTextFileReader::class => new PlainTextFileReader($filesystem),
            JsonFileReader::class      => new JsonFileReader($filesystem),
            default                    => throw new \RuntimeException(json_encode([
                "message" => "file_reader.unknown_file_reader_type",
                "parameters" => [
                    "type" => $className
                ]
            ]))
        };
    }
}
