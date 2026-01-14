<?php

namespace App\Class\Messenger;


use Attribute;

#[Attribute(Attribute::TARGET_CLASS)]
class UniqueMessage
{
    public function __construct(
        public int $ttl = 3600
    ) {}
}
