<?php

namespace App\Class;

class Constants
{
    public const string ROOT_DIRECTORY = __DIR__ . "/../../";
    public const string LOG_DIRECTORY = self::ROOT_DIRECTORY . "var/log/";

    public const string SQL_DEFAULT_DATE_FORMAT = "Y-m-d";

    public const string CONTACT_TYPE_EMAIL = "email";
    public const string CONTACT_TYPE_PHONE = "phone";
    public const string CONTACT_TYPE_ADDRESS = "address";

    public const array COOKIES_NAMES = [
        "LOCALE"  => "SFTOOMI_LOCALE",
        "SESSION" => "SFTOOMI_SESSION",
        "USER"    => "SFTOOMI_USER"
    ];

    public const array AVAILABLE_LOCALES = ["en", "ru"];
}
