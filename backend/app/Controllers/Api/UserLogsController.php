<?php

namespace App\Controllers\Api;

use App\Models\UserLogModel;
use CodeIgniter\RESTful\ResourceController;

class UserLogsController extends ResourceController
{
    public function index()
    {
    // 1. Retrieve query parameters
    $id = $this->request->getGet('id');
    $userId = $this->request->getGet('userId'); // Match variable name
    $username   = $this->request->getGet('username');
    $ipAddress = $this->request->getGet('ipAddress');
    $controllerMethod = $this->request->getGet('controller_method');
    $actionType = $this->request->getGet('action_type');
    $startDate = $this->request->getGet('startDate');
    $endDate = $this->request->getGet('endDate');

    $builder =new UserLogModel();
    
    if (!empty($id)) {
            $builder->where('id', $id);
        }
        if (!empty($userId)) {
            $builder->where('userId', $userId);
        }
        if (!empty($username)) {
            $builder->like('username', $username); // Partial search for usernames
        }
        if (!empty($ipAddress)) {
            $builder->where('ipAddress', $ipAddress);
        }
        if (!empty($controllerMethod)) {
            $builder->like('controller_method', $controllerMethod);
        }
        if (!empty($actionType)) {
            $builder->where('action_type', strtoupper($actionType));
        }
        if (!empty($startDate)) {
            $builder->where('created_at >=', $startDate . ' 00:00:00');
        }
        if (!empty($endDate)) {
            $builder->where('created_at <=', $endDate . ' 23:59:59');
        }

        $logs = $builder->findAll();
        foreach($logs as $log){
        if (isset($log->created_at)) {
            $log->created_at = ($log->created_at instanceof \DateTimeInterface) 
                ? $log->created_at->t
                : (string)$log->created_at;
        }
        }

    return $this->respond([
        'status' => 200,
        'data'   =>$logs
    ]);

    }
}
