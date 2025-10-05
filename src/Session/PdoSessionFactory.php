<?php

namespace App\Session;

use Symfony\Component\HttpFoundation\Session\Storage\Handler\PdoSessionHandler;
use Symfony\Component\HttpFoundation\Session\Storage\NativeSessionStorage;
use Symfony\Component\HttpFoundation\Session\Storage\SessionStorageFactoryInterface;
use Symfony\Component\HttpFoundation\Session\Storage\SessionStorageInterface;
use Symfony\Component\HttpFoundation\Request;

class PdoSessionFactory implements SessionStorageFactoryInterface
{
    public function createStorage(?Request $request): SessionStorageInterface
    {
        $pdoHandler = new PdoSessionHandler(
            $_ENV['DATABASE_URL'],
            [
                'db_table' => 'sessions',
                'db_id_col' => 'session_id',
                'db_data_col' => 'session_data',
                'db_lifetime_col' => 'session_lifetime',
                'db_time_col' => 'session_time'
            ]
        );

        return new NativeSessionStorage([], $pdoHandler);
    }
}
