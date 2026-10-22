<?php

namespace App\Class\PDF;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

readonly class HtmlToPdfConverter
{
    public function __construct(
        private HttpClientInterface $httpClient,
        private string              $pdfServiceUrl,
        private TranslatorInterface $translator
    ) {}

    public function convert(string $htmlFilepath, string $pdfFilepath): array
    {
        try {
            $response = $this->httpClient->request("POST", $this->pdfServiceUrl, [
                "json" => [
                    "htmlFilepath" => $htmlFilepath,
                    "pdfFilepath"  => $pdfFilepath,
                ],
                "timeout" => 30,
            ]);

            $statusCode = $response->getStatusCode();
            $content = $response->toArray(false);

            if ($statusCode !== 200) {
                return [
                    "output"      => [$content["error"] ?? $this->translator->trans("converters.html_to_pdf.unknown_pdf_generation_error")],
                    "result_code" => 1
                ];
            }

            return [
                "output"      => [$this->translator->trans("converters.html_to_pdf.pdf_successfully_generated")],
                "result_code" => 0
            ];

        } catch (\Throwable $e) {
            return [
                "output"      => [$e->getMessage()],
                "result_code" => 1
            ];
        }
    }
}
