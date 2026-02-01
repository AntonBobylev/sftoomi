<?php

namespace App;

use Symfony\Component\Filesystem\Filesystem as SymfonyFilesystem;

class Filesystem extends SymfonyFilesystem
{
    private string $tmpDir;

    public function __construct(string $projectDir)
    {
        $this->tmpDir = $projectDir . "/var/tmp";
    }

    public function getTempFilename(string $prefix = "", string $suffix = ""): string
    {
        if (!$this->exists($this->tmpDir)) {
            $this->mkdir($this->tmpDir);
        }

        $tmpFile = $this->tempnam($this->tmpDir, $prefix);
        $finalPath = $tmpFile . $suffix;

        $this->rename($tmpFile, $finalPath, true);

        return $finalPath;
    }
}
