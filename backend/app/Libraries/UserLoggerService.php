<?php

namespace App\Libraries;

use Config\Services;
use App\Entities\UserLogEntity;
use App\Models\UserLogModel;
//this service has 2 main methods, which are
// gather log data where it gets called inside the filter to send the token receive from the frontend interceptor
// save data which takes the info from the first method and saves it in the users log table
class UserLoggerService{
    private string $controllerMethod;
    private string $ipAddress;
    private string $userAgent;
    private string $urlCalled;
    private string $username;
    private string $userId;
    private string $actionType;
    // gets the token from the filter + interceptor
    function gatherLogData($token){
        //uses request and router to gather other info like the  url  called, ip,user agent,,,etc
        $request = Services::request();
        $router  = Services::router();

        $controller = $router->controllerName();
        $method = $router->methodName();
        //combines both the method and the controller for a single url variable
        $this->controllerMethod = $controller . '::' . $method;
        $this->ipAddress = $request->getIPAddress();

        $this->userAgent = $request->getUserAgent();
        $this->urlCalled = $request->getUri();
        $this->actionType = $request->getMethod();
        //and the rest like the username and id are gathered from the token
        $this->username = $token['preferred_username'];
        $this->userId = $token['sub'];
        // after we gather the data we save it to the db
        $this->saveLogData();
    }

    function saveLogData(){
        //we use the entity instead of an array to save the data
        $userLog =new UserLogEntity();

        $userLog->userId = $this->userId;
        $userLog->username = $this->username;
        $userLog->ipAddress = $this->ipAddress;
        $userLog->url_called = $this->urlCalled;
        $userLog->controller_method = $this->controllerMethod;
        $userLog->action_type = $this->actionType;
        $userLog->user_agent = $this->userAgent;
        // and we use the model to save it
        $logModel = new UserLogModel();
        return $logModel->save($userLog);
    }
    //getters since the attribes are private
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