<?php

namespace App;

use App\Class\Constants;
use App\Class\Core\DB\SqlSubstitutor;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBag;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class Utils
{
    public static function getVars(): ParameterBagInterface
    {
        return new ParameterBag([
            "templates_dir"                    => __DIR__ . "/../templates",
            "entities_relationships_file_path" => __DIR__ . "/../config/app/entities-relationships.json",
            "mailer_mail_host"                 => $_ENV["MAIL_HOST"],
            "mailer_mail_username"             => $_ENV["MAIL_USERNAME"],
            "mailer_mail_password"             => $_ENV["MAIL_PASSWORD"],
            "mailer_mail_port"                 => $_ENV["MAIL_PORT"]
        ]);
    }

    public static function logDump(mixed $data, string $filename = "dumps"): void
    {
        ob_start();
        var_dump($data);
        $data = ob_get_clean();

        $data = sprintf(
            "=== %s %s\n%s%s\n\n",
            date("Y-m-d H:i:s T"),
            str_repeat("=", 92),
            $data,
            str_repeat("=", 120)
        );

        $file = Constants::LOG_DIRECTORY . $filename;
        file_put_contents($file, $data, FILE_APPEND);
    }

    public static function logSql(string $sql, array $params = []): void
    {
        $data = new SqlSubstitutor()->subst($sql, $params);

        $rows = explode("\n", $data);
        $rows = array_map(function ($row) {
            return trim($row);
        }, $rows);

        array_unshift($rows, "");
        $data = implode("\n\t", $rows);
        $data .= "\n";

        self::logDump($data, "sql.log");
    }
}
