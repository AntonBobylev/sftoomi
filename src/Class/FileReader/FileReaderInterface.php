<?php

namespace App\Class\FileReader;

interface FileReaderInterface
{
    public function read(string $filePath): mixed;
}
