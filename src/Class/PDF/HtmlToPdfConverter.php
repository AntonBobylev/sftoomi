<?php

namespace App\Class\PDF;

use App\Utils;

readonly class HtmlToPdfConverter
{
    private string $utilityPath;

    public function __construct()
    {
        $this->utilityPath = Utils::getVars()->get("wkhtmltopdf_path");
    }

    public function convert(string $htmlFilepath, string $pdfFilepath): array
    {
        $command = sprintf(
            "%s --encoding utf-8 --enable-smart-shrinking %s %s",
            $this->utilityPath,
            $htmlFilepath,
            $pdfFilepath
        );

        $output = [];
        $resultCode = 0;

        exec(
            $command,
            $output,
            $resultCode
        );

        return [
            "output"      => $output,
            "result_code" => $resultCode
        ];
    }
}
