<?php

namespace App\Class;

use App\Class\FileReader\FileReaderFactory;
use App\Class\FileReader\JsonFileReader;
use App\Filesystem;
use App\Utils;

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
            throw new \RuntimeException(json_encode([
                "message"    => "template_manager.file_does_not_exist_by_the_path",
                "parameters" => [
                    "%file_path%" => $filePath
                ]
            ]));
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
     * @return array
     */
    private function getMockData(): array
    {
        return new FileReaderFactory()
            ->build(JsonFileReader::class, $this->filesystem)
            ->read(sprintf("%s/mock-data.json", Utils::getVars()->get("templates_dir")));
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
