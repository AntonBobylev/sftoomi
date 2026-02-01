<?php

namespace App\Class;

use App\Utils;
use Symfony\Component\Filesystem\Filesystem;

readonly class TemplateManager
{
    public function __construct(private Filesystem $filesystem)
    {
    }

    public function getTemplate(string $templateName, array $data = [], bool $useMockData = false): string
    {
        $template = $this->getTemplateContent($templateName);

        if ($useMockData) {
            $data = $this->getMockData();
        }

        return $this->apply($template, $data, $useMockData);
    }

    public function apply(string $templateCode, array $data, bool $useMockData = false): string
    {
        if ($useMockData) {
            $data = $this->getMockData();
        }

        $this->renderTemplate($templateCode, $data);

        return $templateCode;
    }

    public function getGenericTemplates(): array
    {
        $genericTemplatesPath = $this->getGenericTemplatesPath();
        $genericTemplatesFilenames = $this->getGenericTemplatesFilenames();

        $files = [];
        foreach ($genericTemplatesFilenames as $file) {
            $files[] = [
                "filename" => $file["filename"],
                "name"     => $file["name"],
                "content"  => $this->filesystem->readFile($genericTemplatesPath . "/" . $file["filename"])
            ];
        }

        return $files;
    }

    private function getTemplateContent(string $templateName): string
    {
        $filePath = sprintf("%s/%s", Utils::getVars()->get("templates_dir"), $templateName);
        if (!$this->filesystem->exists($filePath)) {
            throw new \RuntimeException("File doesn't exist by the path: \"$filePath\"");
        }

        return $this->filesystem->readFile($filePath);
    }

    private function renderTemplate(string &$templateCode, array $data): void
    {
        foreach ($data as $key => $value) {
            $pattern = '/\$\{' . preg_quote($key, '/') . '}/i';
            $templateCode = preg_replace($pattern, $value, $templateCode);
        }
    }

    /**
     * TODO: move JSON file reading into the single class?
     *
     * @return array
     */
    private function getMockData(): array
    {
        $mockFileLocation = sprintf("%s/mock-data.json", Utils::getVars()->get("templates_dir"));
        if (!$this->filesystem->exists($mockFileLocation)) {
            throw new \RuntimeException("File with mock data doesn't exist by the path: \"$mockFileLocation\"");
        }

        $fileRawContent = $this->filesystem->readFile($mockFileLocation);

        $mockData = json_decode($fileRawContent, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \RuntimeException(json_last_error_msg());
        }

        return $mockData;
    }

    private function getGenericTemplatesPath(): string
    {
        return Utils::getVars()->get("templates_dir") . "/generic";
    }

    private function getGenericTemplatesFilenames(): array
    {
        return [[
            "name"     => "Freetext",
            "filename" => "freetext.html"
        ]];
    }
}
