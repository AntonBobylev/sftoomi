<?php

namespace App\Class\Core\DB;

use InvalidArgumentException;
use RuntimeException;

class SqlSubstitutor
{
    private array $escapeRules = [
        '\\' => '\\\\',
        "\0" => '\\0',
        "\n" => '\\n',
        "\r" => '\\r',
        "'"  => "\\'",
        '"'  => '\\"',
        "\x1a" => '\\Z', // Ctrl+Z
        "\t" => '\\t'
    ];

    public function subst(string $sql, array $params): string
    {
        $hasNamedParams = $this->hasNamedParameters($sql);

        if ($hasNamedParams) {
            return $this->processNamedParameters($sql, $params);
        } else {
            return $this->processPositionalParameters($sql, $params);
        }
    }

    public function encodeValue($value): string
    {
        if (is_array($value)) {
            return $this->formatArrayValue($value);
        } elseif (is_string($value)) {
            return $this->quoteString($value);
        } elseif (is_int($value) || is_float($value)) {
            return (string)$value;
        } elseif (is_bool($value)) {
            return $value ? "1" : "0";
        } elseif (is_null($value)) {
            return "NULL";
        } else {
            throw new InvalidArgumentException(json_encode([
                "message"    => "sql_substitutor.unsupported_parameter_type",
                "parameters" => [
                    "%type%" => gettype($value)
                ]
            ]));
        }
    }

    public function encodeName($string): string
    {
        return "`" . $string . "`";
    }

    public function encodeFields($fields): string
    {
        if (count($fields) === 0) {
            throw new RuntimeException("sql_substitutor.unable_to_encode_empty_fields_list");
        }

        return '`' . implode('`, `', $fields) . '`';
    }

    private function hasNamedParameters(string $sql): bool
    {
        return preg_match('/:[a-zA-Z_][a-zA-Z0-9_]*/', $sql) === 1;
    }

    private function processNamedParameters(string $sql, array $params): string
    {
        foreach ($params as $key => $value) {
            $placeholder = ":" . $key;

            if (str_contains($sql, $placeholder)) {
                $replacement = $this->encodeValue($value);
                $sql = str_replace($placeholder, $replacement, $sql);
            }
        }

        return $sql;
    }

    private function processPositionalParameters(string $sql, array $params): string
    {
        $questionCount = substr_count($sql, "?");

        if ($questionCount !== count($params)) {
            throw new InvalidArgumentException(json_encode([
                "message"    => "sql_substitutor.mismatch_between_the_number_of_placeholders_and_parameters",
                "parameters" => [
                    "%placeholders_count%" => $questionCount,
                    "%parameters_count%"   => count($params)
                ]
            ]));
        }

        $parts = preg_split('/(\?)/', $sql, -1, PREG_SPLIT_DELIM_CAPTURE);
        $result = "";
        $paramIndex = 0;

        foreach ($parts as $part) {
            if ($part === "?") {
                $result .= $this->encodeValue($params[$paramIndex]);
                $paramIndex++;
            } else {
                $result .= $part;
            }
        }

        return $result;
    }

    private function formatArrayValue(array $values): string
    {
        if (empty($values)) {
            return "('')";
        }

        $formattedValues = array_map(function($value) {
            return $this->encodeValue($value);
        }, $values);

        return "(" . implode(", ", $formattedValues) . ")";
    }

    private function quoteString(string $value): string
    {
        return "'" . $this->escapeString($value) . "'";
    }

    private function escapeString(string $value): string
    {
        return strtr($value, $this->escapeRules);
    }
}
