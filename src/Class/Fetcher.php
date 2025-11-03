<?php

namespace App\Class;

use DateTime;
use Exception;
use RuntimeException;

class Fetcher
{
    /**
     * Tries to convert the received value to int value.
     * Returns default value if received value cannot be converted to int.
     *
     * @param mixed $value
     * @param mixed $default
     *
     * @return int|null
     */
    public static function int(mixed $value, mixed $default = null): int | null
    {
        if (self::isNull($value)) {
            return $default;
        }

        if (is_bool($value)) {
            return $value ? 1 : 0;
        }

        if ($value === "true") {
            return 1;
        }

        if ($value === "false") {
            return 0;
        }

        if (!is_numeric($value)) {
            return $default;
        }

        return intval($value);
    }

    /**
     * Tries to convert the received value to string and trim it.
     * Returns default value if received value is not numeric and not string, or received value is null.
     *
     * @param mixed $value
     * @param mixed $default
     *
     * @return string|null
     */
    public static function trim(mixed $value, mixed $default = null): string | null
    {
        if ((!is_numeric($value) && !is_string($value)) || self::isNull($value)) {
            return $default;
        }

        return trim($value);
    }

    /**
     * Tries to convert the received value to array of integer values.
     * Returns default value if received value cannot be converted to integer values.
     *
     * @param mixed      $value
     * @param array|null $default
     * @param string $separator
     *
     * @return array|null
     */
    public static function intArray(mixed $value, ?array $default = null, string $separator = ","): array | null
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
                throw new RuntimeException("Not numeric value detected in intArray method");
            }

            return intval($item);
        }, $value);
    }

    /**
     * Tries to convert the received value to date, then formats it to passed format and returns it as string.
     * Returns default value if received value cannot be converted to date.
     *
     * TODO: add any date formats converter because right now we expect the row with some PHP common date format right now
     *
     * @param mixed  $value
     * @param mixed  $default
     * @param string $format
     *
     * @return string|null
     */
    public static function date(
        mixed $value,
        mixed $default = null,
        string $format = Constants::SQL_DEFAULT_DATE_FORMAT
    ): string | null
    {
        if (empty($value)) {
            return $default;
        }

        if (self::isNull($value)) {
            return $default;
        }

        if ($value instanceof DateTime) {
            return $value->format($format);
        }

        if (!is_string($value)) {
            return $default;
        }

        try {
            return new DateTime($value)->format($format);
        } catch (Exception) {
            return $default;
        }
    }

    /**
     * Checks the value is null or not
     *
     * @param $value
     *
     * @return bool
     */
    public static function isNull($value): bool
    {
        return $value === null || $value === "null";
    }

    /**
     * Checks the value is json object and decode it
     *
     * @param mixed      $value
     * @param mixed|null $default
     *
     * @return array|null
     */
    public static function json(mixed $value, mixed $default = null): array | null
    {
        $value = Fetcher::trim($value);
        if (self::isNull($value)) {
            return $default;
        }

        $value = json_decode($value, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return $default;
        }

        return $value;
    }
}
