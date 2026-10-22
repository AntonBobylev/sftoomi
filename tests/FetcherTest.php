<?php

namespace App\Tests;

use App\Class\Fetcher;
use PHPUnit\Framework\TestCase;

class FetcherTest extends TestCase
{
    public function testInt(): void
    {
        test
        $value = Fetcher::int(1);
        $this->assertIsInt($value);
        $this->assertEquals(1, $value);

        $value = Fetcher::int(1.5351865);
        $this->assertIsInt($value);
        $this->assertEquals(1, $value);

        $value = Fetcher::int(true);
        $this->assertEquals(1, $value);

        $value = Fetcher::int(false);
        $this->assertEquals(0, $value);

        $value = Fetcher::int("test", 42);
        $this->assertEquals(42, $value);

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

        $value = Fetcher::intArray("1");
        $this->assertEquals([1], $value);

        $value = Fetcher::intArray(null, []);
        $this->assertEquals([], $value);

        $value = Fetcher::intArray(1);
        $this->assertEquals(null, $value);

        $this->expectException(\RuntimeException::class);
        Fetcher::intArray("test");
    }

    public function testIntArrayWithMultipleInvalidValues(): void
    {
        $this->expectException(\RuntimeException::class);
        Fetcher::intArray("test,test");
    }

    public function testIntArrayValidCases(): void
    {
        $value = Fetcher::intArray([1, 2, 3, 4, 5]);
        $this->assertIsArray($value);
        $this->assertEquals([1, 2, 3, 4, 5], $value);

        $value = Fetcher::intArray("1, 2, 3, 4, 5");
        $this->assertIsArray($value);
        $this->assertEquals([1, 2, 3, 4, 5], $value);

        $value = Fetcher::intArray(["1", "2", "3", "4", "5"]);
        $this->assertIsArray($value);
        $this->assertEquals([1, 2, 3, 4, 5], $value);

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

        $value = Fetcher::date("2025-03-26");
        $this->assertEquals("2025-03-26", $value);

        $value = Fetcher::date("26.03.2025");
        $this->assertEquals("2025-03-26", $value);

        $value = Fetcher::date("26.03.2025", null, "d/m/Y");
        $this->assertEquals("26/03/2025", $value);

        $dateTime = new \DateTime("2025-05-10");
        $value = Fetcher::date($dateTime);
        $this->assertEquals("2025-05-10", $value);
    }

    public function testIsNull(): void
    {
        $value = Fetcher::isNull("test");
        $this->assertFalse($value);

        $value = Fetcher::isNull(0);
        $this->assertFalse($value);

        $value = Fetcher::isNull(false);
        $this->assertFalse($value);

        $value = Fetcher::isNull("null");
        $this->assertTrue($value);

        $value = Fetcher::isNull(null);
        $this->assertTrue($value);
    }

    public function testGender(): void
    {
        $value = Fetcher::gender(0);
        $this->assertIsInt($value);
        $this->assertEquals(0, $value);

        $value = Fetcher::gender('1');
        $this->assertIsInt($value);
        $this->assertEquals(1, $value);

        $value = Fetcher::gender(2);
        $this->assertEquals(null, $value);

        $value = Fetcher::gender(null, 0);
        $this->assertIsInt($value);
        $this->assertEquals(0, $value);
    }

    public function testJson(): void
    {
        $value = Fetcher::json('{"foo":"bar"}');
        $this->assertIsArray($value);
        $this->assertEquals(['foo' => 'bar'], $value);

        $value = Fetcher::json('invalid-json', ['default' => true]);
        $this->assertEquals(['default' => true], $value);

        $value = Fetcher::json(null);
        $this->assertNull($value);
    }
}
