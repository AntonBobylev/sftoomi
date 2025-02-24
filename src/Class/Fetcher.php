<?php

namespace App\Class;

use DateTime;

class Fetcher
{
    public static function int($value, $default = null): ?int
    {
        $result = intval($value);
        if (!$result || self::isNull($value)) {
            return $default;
        }

        return $result;
    }

    public static function trim($value, $default = null): ?string
    {
        if (!is_string($value) || self::isNull($value)) {
            return $default;
        }

        return trim($value);
    }

    public static function intArray($value, $default = null): array
    {
        if (self::isNull($value)) {
            return $default;
        }

        if (is_string($value)) {
            $value =  explode(',', $value);
        }

        return array_map('intval', $value);
    }

    public static function date($value, $default = null): ?string
    {
        if (self::isNull($value)) {
            return $default;
        }

        if (($value = strtotime($value)) !== false) {
            $value = new DateTime()->setTimestamp($value)->format("Y-m-d");
        } else {
            return $default;
        }

        return $value;
    }

    public static function isNull($value): bool
    {
        return $value === null || $value === "null";
    }
}
