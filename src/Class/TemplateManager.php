<?php

namespace App\Class;

use App;
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

        if (!empty($data)) {
            $template = $this->apply($template, $data);
        }

        return $template;
    }

    public function apply(string $templateCode, array $data): string
    {
        $this->renderTemplate($templateCode, $data);

        return $templateCode;
    }

    private function getTemplateContent(string $templateName): string
    {
        $filePath = sprintf("%s/%s", App::getVars()->get("templates_dir"), $templateName);
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
        $mockFileLocation = sprintf("%s/mock-data.json", App::getVars()->get("templates_dir"));
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
}
