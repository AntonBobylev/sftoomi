<?php

namespace App\Class\FileReader;

use App\Filesystem;

abstract class AbstractFileReader implements FileReaderInterface
{
    private readonly Filesystem $filesystem;

    public function __construct(Filesystem $filesystem)
    {
        $this->filesystem = $filesystem;
    }

    public function read(string $filePath): mixed
    {
        if (!$this->filesystem->exists($filePath)) {
            throw new \RuntimeException(json_encode([
                "message"    => "file_reader.file_does_not_exist",
                "parameters" => [
                    "%file_path%" => $filePath
                ]
            ]));
        }

        return $this->filesystem->readFile($filePath);
    }
}
