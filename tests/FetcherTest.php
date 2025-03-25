<?php

namespace App\Tests;

use App\Class\Fetcher;
use PHPUnit\Framework\TestCase;

class FetcherTest extends TestCase
{
    public function testInt(): void
    {
        $value = Fetcher::int(1);
        $this->assertIsInt($value);
        $this->assertEquals(1, $value);

        $value = Fetcher::int(1.5351865);
        $this->assertIsInt($value);
        $this->assertEquals(1, $value);

        $value = Fetcher::int("test");
        $this->assertEquals(null, $value);

        $value = Fetcher::int(null);
        $this->assertEquals(null, $value);

        $value = Fetcher::int(null, true);
        $this->assertEquals(true, $value);
    }

    public function testTrim(): void
    {
        $value = Fetcher::trim(1);
        $this->assertIsString($value);
        $this->assertEquals("1", $value);

        $value = Fetcher::trim(1.5);
        $this->assertIsString($value);
        $this->assertEquals("1.5", $value);

        $value = Fetcher::trim("SFTOOMI");
        $this->assertIsString($value);
        $this->assertEquals("SFTOOMI", $value);

        $value = Fetcher::trim("SFTOOMI   ");
        $this->assertIsString($value);
        $this->assertEquals("SFTOOMI", $value);

        $value = Fetcher::trim("            SFTOOMI");
        $this->assertIsString($value);
        $this->assertEquals("SFTOOMI", $value);

        $value = Fetcher::trim("  SFTOOMI   ");
        $this->assertIsString($value);
        $this->assertEquals("SFTOOMI", $value);

        $value = Fetcher::trim([]);
        $this->assertEquals(null, $value);

        $value = Fetcher::trim([], "default");
        $this->assertIsString($value);
        $this->assertEquals("default", $value);

        $value = Fetcher::trim(true);
        $this->assertEquals(null, $value);
    }

    public function testIntArray(): void
    {
        $value = Fetcher::intArray(null);
        $this->assertEquals(null, $value);

        $value = Fetcher::intArray(null, []);
        $this->assertEquals([], $value);

        $value = Fetcher::intArray(1);
        $this->assertEquals(null, $value);

        $value = Fetcher::intArray("test");
        $this->assertEquals(null, $value);

        $this->expectException(\RuntimeException::class);
        Fetcher::intArray("test,test");

        $value = Fetcher::intArray([1, 2, 3, 4, 5]);
        $this->assertIsArray($value);
        $this->assertEquals([1, 2, 3, 4, 5], $value);

        $value = Fetcher::intArray(["1, 2, 3, 4, 5"]);
        $this->assertIsArray($value);
        $this->assertEquals([1, 2, 3, 4, 5], $value);

        $value = Fetcher::intArray(["1", "2", "3", "4", "5"]);
        $this->assertIsArray($value);
        $this->assertEquals([1, 2, 3, 4, 5], $value);

        $value = Fetcher::intArray(["1"]);
        $this->assertIsArray($value);
        $this->assertEquals([1], $value);

        $value = Fetcher::intArray(["1.2345", "2.3456", "3.4567", "4.5678", "5.6789"]);
        $this->assertIsArray($value);
        $this->assertEquals([1, 2, 3, 4, 5], $value);
    }

    public function testDate(): void
    {
        $value = Fetcher::date(null);
        $this->assertEquals(null, $value);

        $value = Fetcher::date(1);
        $this->assertEquals(null, $value);

        $value = Fetcher::date([]);
        $this->assertEquals(null, $value);

        $value = Fetcher::date("test");
        $this->assertEquals(null, $value);

        $value = Fetcher::date("26-03-2025");
        $this->assertEquals("2025-03-26", $value);
    }

    public function testIsNull()
    {
        $value = Fetcher::isNull("test");
        $this->assertFalse($value);

        $value = Fetcher::isNull(1);
        $this->assertFalse($value);

        $value = Fetcher::isNull(1.2345);
        $this->assertFalse($value);

        $value = Fetcher::isNull(0);
        $this->assertFalse($value);

        $value = Fetcher::isNull(false);
        $this->assertFalse($value);

        $value = Fetcher::isNull(true);
        $this->assertFalse($value);

        $value = Fetcher::isNull([]);
        $this->assertFalse($value);

        $value = Fetcher::isNull("null");
        $this->assertTrue($value);

        $value = Fetcher::isNull(null);
        $this->assertTrue($value);
    }
}
