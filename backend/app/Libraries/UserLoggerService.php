<?php

namespace App\Libraries;

use Config\Services;
use App\Entities\UserLogEntity;
use App\Models\UserLogModel;

class UserLoggerService{
    private string $controllerMethod;
    private string $ipAddress;
    private string $userAgent;
    private string $urlCalled;
    private string $username;
    private string $userId;
    private string $actionType;
    
    function gatherLogData($token){
        $request = Services::request();
        $router  = Services::router();

        $controller = $router->controllerName();
        $method = $router->methodName();

        $this->controllerMethod = $controller . '::' . $method;
        $this->ipAddress = $request->getIPAddress();

        $this->userAgent = $request->getUserAgent();
        $this->urlCalled = $request->getUri();
        $this->actionType = $request->getMethod();

        $this->username = $token['preferred_username'];
        $this->userId = $token['sub'];

        $this->saveLogData();
    }

    function saveLogData(){
        $userLog =new UserLogEntity();

        $userLog->userId = $this->userId;
        $userLog->username = $this->username;
        $userLog->ipAddress = $this->ipAddress;
        $userLog->url_called = $this->urlCalled;
        $userLog->controller_method = $this->controllerMethod;
        $userLog->action_type = $this->actionType;
        $userLog->user_agent = $this->userAgent;

        $logModel = new UserLogModel();
        return $logModel->save($userLog);
    }

    public function getControllerMethod(): string
    {
        return $this->controllerMethod;
    }

    public function getIpAddress(): string
    {
        return $this->ipAddress;
    }

    public function getUserAgent(): string
    {
        return $this->userAgent;
    }

    public function getUrlCalled(): string
    {
        return $this->urlCalled;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function getUserId(): string
    {
        return $this->userId;
    }

    public function getActionType(): string
    {
        return $this->actionType;
    }
}