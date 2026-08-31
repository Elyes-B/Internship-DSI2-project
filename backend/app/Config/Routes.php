<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */

$routes->group('api', ['filter'=>'authFilter','namespace' => 'App\Controllers\Api'], function ($routes) {
    $routes->get('users/session', 'SessionController::getSessionBySessionId');
    $routes->post('users/session', 'SessionController::registerSession');
    $routes->post('users/active/db', 'UserController::getAllUsersFromUsernameList');
    $routes->resource('users/logs', ['controller'=>'UserLogsController']);
    $routes->resource('users/active/keycloak', ['controller'=>'SessionController']);
    $routes->resource('users', ['controller' => 'UserController']);
});

