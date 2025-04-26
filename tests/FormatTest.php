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

        $this->assertIsString($value);
        $this->assertEquals("SMITH, J.B.", $value);

        $value = Format::humanShortName([
            "last_name"   => "",
            "first_name"  => "JOHN",
            "middle_name" => "BRUCE"
        ]);

        $this->assertIsString($value);
        $this->assertEquals("J.B.", $value);

        $value = Format::humanShortName([
            "last_name"   => "",
            "first_name"  => "",
            "middle_name" => "BRUCE"
        ]);

        $this->assertIsString($value);
        $this->assertEquals("B.", $value);

        $value = Format::humanShortName([
            "last_name"   => "",
            "first_name"  => "",
            "middle_name" => ""
        ]);

        $this->assertIsString($value);
        $this->assertEquals("", $value);

        $value = Format::humanShortName([
            "last_name"   => "SMITH",
            "first_name"  => "",
            "middle_name" => "BRUCE"
        ]);

        $this->assertIsString($value);
        $this->assertEquals("SMITH, B.", $value);

        $value = Format::humanShortName([
            "last_name"   => "SMITH",
            "first_name"  => "",
            "middle_name" => ""
        ]);

        $this->assertIsString($value);
        $this->assertEquals("SMITH", $value);
    }
    public function testArgs(): void
    {
        $value = Format::humanShortName("SMITH", "JOHN", "BRUCE");

        $this->assertIsString($value);
        $this->assertEquals("SMITH, J.B.", $value);

        $value = Format::humanShortName("", "JOHN", "BRUCE");

        $this->assertIsString($value);
        $this->assertEquals("J.B.", $value);

        $value = Format::humanShortName("");

        $this->assertIsString($value);
        $this->assertEquals("", $value);
    }
}
