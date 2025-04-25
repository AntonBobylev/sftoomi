<?php

namespace App\Class;

class Format
{
    public static function humanShortName($arg1, $arg2 = null, $arg3 = null): string
    {
        if (is_array($arg1)) {
            $last = $arg1["last_name"];
            $first = $arg1["first_name"];
            $middle = $arg1["middle_name"];
        } else {
            $last = $arg1;
            $first = $arg2;
            $middle = $arg3;
        }

        $last = trim($last);

        $first = substr(trim($first), 0, 1);
        if ($first != "") {
            $first .= ".";
        }

        $middle = substr(trim($middle), 0, 1);
        if ($middle != "") {
            $middle .= ".";
        }

        if (!empty($last) && empty($first) && empty($middle)) {
            return $last;
        }

        return trim($last . ($last ? ", " : "") . $first . $middle);
    }
}
