<?php

use App\Class\Format;
use PHPUnit\Framework\TestCase;

class FormatTest extends TestCase
{
    public function testArray(): void
    {
        $value = Format::humanShortName([
            "last_name"   => "SMITH",
            "first_name"  => "JOHN",
            "middle_name" => "BRUCE"
        ]);
        $this->assertEquals("SMITH, J.B.", $value);

        $value = Format::humanShortName([
            "last_name"   => " SMITH ",
            "first_name"  => " JOHN ",
            "middle_name" => " BRUCE "
        ]);
        $this->assertEquals("SMITH, J.B.", $value);

        $value = Format::humanShortName([
            "last_name"   => "",
            "first_name"  => "JOHN",
            "middle_name" => "BRUCE"
        ]);
        $this->assertEquals("J.B.", $value);

        $value = Format::humanShortName([
            "last_name"   => "",
            "first_name"  => "",
            "middle_name" => "BRUCE"
        ]);
        $this->assertEquals("B.", $value);

        $value = Format::humanShortName([
            "last_name"   => "",
            "first_name"  => "",
            "middle_name" => ""
        ]);
        $this->assertEquals("", $value);

        $value = Format::humanShortName([
            "last_name"   => "SMITH",
            "first_name"  => "",
            "middle_name" => "BRUCE"
        ]);
        $this->assertEquals("SMITH, B.", $value);

        $value = Format::humanShortName([
            "last_name"   => "SMITH",
            "first_name"  => "",
            "middle_name" => ""
        ]);
        $this->assertEquals("SMITH", $value);
    }

    public function testArgs(): void
    {
        $value = Format::humanShortName("SMITH", "JOHN", "BRUCE");
        $this->assertEquals("SMITH, J.B.", $value);

        $value = Format::humanShortName("SMITH", null, null);
        $this->assertEquals("SMITH", $value);

        $value = Format::humanShortName("", "JOHN", "BRUCE");
        $this->assertEquals("J.B.", $value);

        $value = Format::humanShortName("");
        $this->assertEquals("", $value);
    }
}
