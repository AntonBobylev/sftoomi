<?php

namespace App\Class;

use DateTime;

class Fetcher
{
    public const string SQL_DEFAULT_DATE_FORMAT = "Y-m-d";

    public static function int($value, $default = null): ?int
    {
        if (self::isNull($value) || !is_numeric($value)) {
            return $default;
        }

        return intval($value);
    }

    public static function trim($value, $default = null): ?string
    {
        if ((!is_numeric($value) && !is_string($value)) || self::isNull($value)) {
            return $default;
        }

        return trim($value);
    }

    public static function intArray($value, ?array $default = null, string $separator = ","): ?array
    {
        if (self::isNull($value)) {
            return $default;
        }

        if (is_string($value)) {
            $value = explode($separator, $value);
        }

        if (!is_array($value)) {
            return $default;
        }

        return array_map(function ($item) {
            if (!is_numeric($item)) {
                throw new \RuntimeException("Not numeric value detected in intArray method");
            }

            return intval($item);
        }, $value);
    }

    /**
     * Note that we expect the row with some PHP common date format
     * TODO: add any date formats converter
     *
     * @param $value
     * @param $default
     * @return string|null
     */
    public static function date($value, $default = null): ?string
    {
        if (self::isNull($value)) {
            return $default;
        }

        if ($value instanceof DateTime) {
            return $value->format(self::SQL_DEFAULT_DATE_FORMAT);
        }

        if (!is_string($value)) {
            return $default;
        }

        try {
            return new DateTime($value)->format(self::SQL_DEFAULT_DATE_FORMAT);
        } catch (\Exception) {
            return $default;
        }
    }

    public static function isNull($value): bool
    {
        return $value === null || $value === "null";
    }
}
