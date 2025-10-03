<?php

namespace App\Class;

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
}
