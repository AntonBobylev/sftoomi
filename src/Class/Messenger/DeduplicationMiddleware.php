<?php

namespace App\Class\Messenger;

use Psr\Cache\CacheItemPoolInterface;
use Symfony\Component\Messenger\Envelope;
use Symfony\Component\Messenger\Middleware\MiddlewareInterface;
use Symfony\Component\Messenger\Middleware\StackInterface;
use Symfony\Component\Messenger\Stamp\ReceivedStamp;

readonly class DeduplicationMiddleware implements MiddlewareInterface
{
    public function __construct(
        private CacheItemPoolInterface $cache
    ) {
    }

    public function handle(Envelope $envelope, StackInterface $stack): Envelope
    {
        $message = $envelope->getMessage();

        $reflection = new \ReflectionClass($message);
        $attribute = $reflection->getAttributes(UniqueMessage::class)[0] ?? null;

        if (!$attribute) {
            return $stack->next()->handle($envelope, $stack);
        }

        /** @var UniqueMessage $config */
        $config = $attribute->newInstance();
        $messageId = md5(serialize($message));

        $key = sprintf(
            'msg_lock_%s_%s',
            str_replace('\\', '_', $reflection->getName()),
            $messageId
        );

        if (!$envelope->last(ReceivedStamp::class)) {
            $cacheItem = $this->cache->getItem($key);

            if ($cacheItem->isHit()) {
                return $envelope;
            }

            // Устанавливаем замок
            $cacheItem->set(true);
            $cacheItem->expiresAfter($config->ttl);
            $this->cache->save($cacheItem);

            return $stack->next()->handle($envelope, $stack);
        }

        try {
            return $stack->next()->handle($envelope, $stack);
        } finally {
            $this->cache->deleteItem($key);
        }
    }
}
