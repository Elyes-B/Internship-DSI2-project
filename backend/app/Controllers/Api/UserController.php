<?php

namespace App\Controllers\Api;

use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use App\Libraries\KeycloakAdminService;

class UserController extends ResourceController
{
    //keycloak service varaible
    private KeycloakAdminService $keycloakAdminService;
    /**
     * Return an array of resource objects, themselves in array format.
     *
     * @return ResponseInterface
     */

    //the point of this method is to fetch a list of users depending on the filters the admin user
    public function index()
{
    // filter parameters sent via get parameters
    $id = $this->request->getGet(('id'));
    $search = $this->request->getGet('search');
    $role   = $this->request->getGet('role');
    $status = $this->request->getGet('status');
    // we use the model to search through the db tables using the filters
    $builder =new UserModel();
    if (!empty($id)) {
        $builder->where('id',$id);
    }

    
    if (!empty($search)) {
        $builder->groupStart()
                ->like('username', $search)   
                ->orLike('email', $search)        
                ->groupEnd();
    }

    
    if (!empty($role)) {
        $builder->where('role', $role);
    }

    
    if (!empty($status)) {
    if ($status === 'deleted') {
        $builder->where('is_deleted IS NOT NULL');
    } else {
        $builder->where('is_deleted IS NULL');
    }
    }

    
    $users = $builder->findAll();

    return $this->respond([
        'status' => 200,
        'data'   => $users
    ]);
}


//here we get the usersname of active sessions and  fetch their respective user from the db
public function getAllUsersFromUsernameList(){
    $usernames = $this->request->getVar('usernames');

    if(empty($usernames)){
        return $this->respond([
        'status' =>200,
        'data' =>[],
        'message' => 'no usernames were sent, an empty array was received in the backend'
    ]);
    }
    // we use model to match usernames
    $builder =new UserModel();
    $users = $builder->whereIn('username',$usernames)
    ->findAll();

    return $this->respond([
        'status' =>200,
        'data' =>$users
    ]);
}

    /**
     * Return the properties of a resource object.
     *
     * @param int|string|null $id
     *
     * @return ResponseInterface
     */
    public function show($email = null)
    {
     
    }

    /**
     * Return a new resource object, with default properties.
     *
     * @return ResponseInterface
     */
    public function new()
    {
        //
    }

    /**
     * Create a new resource object, from "posted" parameters.
     *
     * @return ResponseInterface
     */
    public function create()
    {
        //
    }

    /**
     * Return the editable properties of a resource object.
     *
     * @param int|string|null $id
     *
     * @return ResponseInterface
     */
    public function edit($id = null)
    {
        //
    }

    /**
     * Add or update a model resource, from "posted" properties.
     *
     * @param int|string|null $id
     *
     * @return ResponseInterface
     */
    public function update($id = null)
    {
        //
    }

    /**
     * Delete the designated resource object from the model.
     *
     * @param int|string|null $id
     *
     * @return ResponseInterface
     */
    public function delete($id = null)
    {
        //
    }
}
