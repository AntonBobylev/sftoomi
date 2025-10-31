<?php

namespace App\Class\Utils;

use InvalidArgumentException;
use Random\RandomException;
use RuntimeException;

class PasswordGenerator
{
    private const string LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private const string UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private const string NUMBERS = "0123456789";
    private const string SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?";

    private bool $useLowercase = true;
    private bool $useUppercase = true;
    private bool $useNumbers = true;
    private bool $useSymbols = false;
    private int $length = 12;
    private int $minLength = 8;

    public function setLength(int $length): self
    {
        if ($length < $this->minLength) {
            throw new InvalidArgumentException("Password length must be at least 4 characters");
        }
        
        $this->length = $length;
        
        return $this;
    }

    public function useLowercase(bool $use = true): self
    {
        $this->useLowercase = $use;
        
        return $this;
    }

    public function useUppercase(bool $use = true): self
    {
        $this->useUppercase = $use;
        
        return $this;
    }

    public function useNumbers(bool $use = true): self
    {
        $this->useNumbers = $use;
        
        return $this;
    }

    public function useSymbols(bool $use = true): self
    {
        $this->useSymbols = $use;
        
        return $this;
    }

    /**
     * @throws RandomException
     */
    public function generate(): string
    {
        $characterDictionary = $this->buildCharactersDictionary();

        if (empty($characterDictionary)) {
            throw new RuntimeException("No character types selected for password generation");
        }

        $dictionaryLength = strlen($characterDictionary);

        $password = "";
        for ($i = 0; $i < $this->length; $i++) {
            $password .= $characterDictionary[random_int(0, $dictionaryLength - 1)];
        }

        return str_shuffle($password);
    }

    private function buildCharactersDictionary(): string
    {
        $dictionary = "";

        if ($this->useLowercase) {
            $dictionary .= self::LOWERCASE;
        }

        if ($this->useUppercase) {
            $dictionary .= self::UPPERCASE;
        }

        if ($this->useNumbers) {
            $dictionary .= self::NUMBERS;
        }

        if ($this->useSymbols) {
            $dictionary .= self::SYMBOLS;
        }

        return $dictionary;
    }
}
