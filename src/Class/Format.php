<?php

namespace App\Class;

use DateTime;

class Format
{
    /**
     * Converts the received arguments and formats to string.
     * @example $arg1: "Doe", $arg2: "John", $arg3: "Smith", the result: "Doe J.S."
     *
     * @param mixed $arg1
     * @param mixed $arg2
     * @param mixed $arg3
     *
     * @return string
     */
    public static function humanShortName(mixed $arg1, mixed $arg2 = null, mixed $arg3 = null): string
    {
        if (is_array($arg1)) {
            $last   = $arg1["last_name"];
            $first  = $arg1["first_name"];
            $middle = $arg1["middle_name"];
        } else {
            $last   = $arg1;
            $first  = $arg2;
            $middle = $arg3;
        }

        $last   = $last   ?? "";
        $first  = $first  ?? "";
        $middle = $middle ?? "";

        $last = trim($last);
        $first = mb_substr(trim($first), 0, 1);
        if ($first != "") {
            $first .= ".";
        }

        $middle = mb_substr(trim($middle), 0, 1);
        if ($middle != "") {
            $middle .= ".";
        }

        if (!empty($last) && empty($first) && empty($middle)) {
            return $last;
        }

        return trim($last . ($last ? ", " : "") . $first . $middle);
    }

    /**
     * Tries to convert various date representations (strings, timestamps, DateTime) into a DateTime object.
     *
     * @param mixed $value
     *
     * @return DateTime|null
     */
    public static function parseDateToDateTime(mixed $value): ?DateTime
    {
        if (empty($value)) {
            return null;
        }

        if ($value instanceof DateTime) {
            return clone $value;
        }

        if (is_numeric($value)) {
            $num = (int)$value;
            if ($num < 1000000000) {
                return null;
            }

            // Support timestamps (seconds vs milliseconds)
            $timestamp = strlen((string)$value) > 10 ? (int)($value / 1000) : $num;
            $dt = new DateTime();
            @$dt->setTimestamp($timestamp);
            return $dt;
        }

        if (!is_string($value)) {
            return null;
        }

        $trimmed = trim($value);
        if ($trimmed === '') {
            return null;
        }

        // Common formats that PHP's native DateTime parser might fail on (e.g. DD.MM.YYYY)
        $customFormats = [
            'd.m.Y H:i:s',
            'd.m.Y H:i',
            'd.m.Y',
            'd/m/Y H:i:s',
            'd/m/Y H:i',
            'd/m/Y',
            'Y-m-d H:i:s',
            'Y-m-d H:i',
            'Y-m-d',
        ];

        foreach ($customFormats as $format) {
            $dt = DateTime::createFromFormat($format, $trimmed);
            if ($dt !== false) {
                $errors = DateTime::getLastErrors();
                if (is_array($errors) && $errors['warning_count'] === 0 && $errors['error_count'] === 0) {
                    return $dt;
                }
            }
        }

        // Native fallback for ISO and standard PHP string formats
        try {
            return new DateTime($trimmed);
        } catch (\Exception) {
            return null;
        }
    }
}
