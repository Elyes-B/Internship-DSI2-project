<?php

namespace App\Controllers\Api;

use App\Libraries\KeycloakAdminService;
use App\Models\SessionModel;
use CodeIgniter\RESTful\ResourceController;

class SessionController extends ResourceController
{   // we will use the keycloak admin service to help us fetch sessions
    private KeycloakAdminService $keycloakAdminService;
    // the index method returns sessions depending on filters
    public function index()
    {
    helper('ms_to_date');
    //filters used by the usesr
    $id = $this->request->getGet('id');
    $userId = $this->request->getGet('userId'); 
    $ipAddress   = $this->request->getGet('ipAddress');
    $userName = $this->request->getGet('userName');
    $onlyActiveSessions = $this->request->getGet('onlyActiveSessions'); // determines if we fetch from db or keycloak action sessions

    $this->keycloakAdminService = new KeycloakAdminService();
    // first we fetch active users
    $users = $this->keycloakAdminService->getActiveUsers();
    $formattedUsers = [];

    // but if the users decides to fetch all sessions then we ignore the previous value and apply a new one
    if($onlyActiveSessions == false){
        $sessionModel =new SessionModel();
        $users = $sessionModel->asArray()->findAll();
    }
    // we filter users by using loops with comparison
    //  we use the helper method to transform the dates to from ms to datetime for display
    foreach($users as $user){
        $matchId       = empty($id)        || (isset($user['id']) && $user['id'] == $id);
        $matchUserId   = empty($userId)    || (isset($user['userId']) && $user['userId'] == $userId);
        $matchIp       = empty($ipAddress) || (isset($user['ipAddress']) && $user['ipAddress'] == $ipAddress);
        $matchUsername = empty($userName)  || (isset($user['username']) && strcasecmp($user['username'], $userName) === 0);
        if($matchId && $matchUserId && $matchIp && $matchUsername){
        if (isset($user['start']) && is_numeric($user['start'])) {
                $user['start'] = ms_to_date($user['start']);
        }
        if (isset($user['lastAccess']) && is_numeric($user['lastAccess'])) {
                $user['lastAccess'] = ms_to_date($user['lastAccess']);
        }
        $formattedUsers[] = $user;
    }
    }
    // return the users
    return $this->respond([
        'status' =>200,
        'data' =>$formattedUsers
    ]);

    }
    //fetches a session from a session id from active sessions
    public function getSessionBySessionId(){
        $this->keycloakAdminService = new KeycloakAdminService();
        $id = $this->request->getGet('id');
        if (!$id) {
        return $this->fail('Session ID parameter is required', 400);
        }

        $userSession = $this->keycloakAdminService->getSessionFromSessionId($id);
        return $this->respond([
        'status' =>200,
        'data' =>$userSession
    ]);
    }
    //gets the session sent from the post request and saves it after using helper date to transform it from ms to date
    public function registerSession(){
        helper('ms_to_date');
        $session = $this->request->getJSON(true);

        if (isset($session['start']) && is_numeric($session['start'])) {
                $session['start'] = ms_to_date($session['start']);
        }
        if (isset($session['lastAccess']) && is_numeric($session['lastAccess'])) {
                $session['lastAccess'] = ms_to_date($session['lastAccess']);
        }

        

        $sessionModel =new SessionModel();
        if(!empty($sessionModel->find($session['id']))){
            return $this->respond([
        'status' =>401,
        'data' =>$session,
        'message' =>'duplicate session id'
    ]);
        }
        $sessionModel->insert($session);

        return $this->respond([
        'status' =>200,
        'data' =>$session
    ]);
    }
}
