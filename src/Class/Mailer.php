<?php

namespace App\Class;

use App\Utils;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

readonly class Mailer
{
    private ParameterBagInterface $systemVariables;
    private LoggerInterface $logger;

    private PHPMailer $mailer;

    public function __construct(LoggerInterface $logger)
    {
        $this->systemVariables = Utils::getVars();
        $this->logger = $logger;

        $this->mailer = new PHPMailer();

        $this->assertEnvVariables();
        $this->init();
    }

    public function applyTemplate(string $data): void
    {
        $this->mailer->Subject = $this->parseSubject($data);
        $this->mailer->Body    = $data;

        $this->mailer->isHTML();
    }

    public function setSubject(string $subject): self
    {
        $this->mailer->Subject = $subject;

        return $this;
    }

    public function setBody(string $data): self
    {
        $this->mailer->Body = $data;

        return $this;
    }

    /**
     * @throws Exception
     */
    public function addAddresses(array $addresses): self
    {
        foreach ($addresses as $address) {
            $this->mailer->addAddress($address);
        }

        return $this;
    }

    public function send(): void
    {
        try {
            $this->logger->info(sprintf("Attempting to send email to %s", implode(", ", $this->getRecipients())));

            $sendingResult = $this->mailer->send();

            if ($sendingResult) {
                $this->logger->info("Email sent successfully");
            } else {
                $this->logger->error(sprintf("Email sending failed due to error: %s", $this->mailer->ErrorInfo));
                throw new RuntimeException($this->mailer->ErrorInfo);
            }
        } catch (\Exception $e) {
            $error = $this->mailer->ErrorInfo;
            if (empty($error)) {
                $error = $e->getMessage();
            }

            $this->logger->error($error);

            throw new RuntimeException($e->getMessage());
        }
    }

    private function parseSubject(&$data): string
    {
        $re = '/<subject>(.*)<\/subject>/is';
        if (!preg_match($re, $data, $matches)) {
            return "";
        }

        $data    = preg_replace($re, "", $data);

        $subject = $matches[1];
        $subject = preg_replace('/\s+/', " ", $subject);

        return $this->htmlToText($subject);
    }

    private function htmlToText($data): string
    {
        $data = preg_replace('/<[bh]r(?:\s+[^>]*)?>\n?/i', "\n", $data);
        $data = preg_replace('/<(style|script)[^>]*>[^<]*<\/(style|script)>/i', "", $data);

        return strip_tags($data);
    }

    /**
     * @throws Exception
     */
    private function init(): void
    {
        $this->mailer->isSMTP();
        $this->mailer->Host = $this->systemVariables->get("mailer_mail_host");
        $this->mailer->SMTPAuth = true;
        $this->mailer->Username = $this->systemVariables->get("mailer_mail_username");
        $this->mailer->Password = $this->systemVariables->get("mailer_mail_password");
        $this->mailer->Port = $this->systemVariables->get("mailer_mail_port");
        $this->mailer->SMTPSecure = "ssl";

        $this->mailer->setFrom($this->mailer->Username, "SFTOOMI");
    }

    private function assertEnvVariables(): void
    {
        if (!$this->systemVariables->has("mailer_mail_host")) {
            throw new RuntimeException("Mailer host not set");
        }

        if (!$this->systemVariables->has("mailer_mail_username")) {
            throw new RuntimeException("Mailer username not set");
        }

        if (!$this->systemVariables->has("mailer_mail_password")) {
            throw new RuntimeException("Mailer password not set");
        }

        if (!$this->systemVariables->has("mailer_mail_port")) {
            throw new RuntimeException("Mailer port not set");
        }
    }

    private function getRecipients(): array
    {
        return array_map(function($recipient) {
            return $recipient[0];
        }, $this->mailer->getToAddresses());
    }
}
