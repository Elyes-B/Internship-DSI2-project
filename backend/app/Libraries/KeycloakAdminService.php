<?php

namespace App\Libraries;

use App\Models\UserModel;
use CodeIgniter\HTTP\CURLRequest;
use Throwable;

class KeycloakAdminService
{
    private string $baseUrl;  // the url to our keycloak container inside of our docker
    private string $realm;    // the name of the real we are working with in keycloak
    private CURLRequest $client;

    public function __construct()
    {
        $this->baseUrl = env('keycloak_url');
        $this->realm = env('keycloak_realm');
        $this->client = service('curlrequest');
    }

    //main functions

    public function syncAllAdmins(): array
    {   

        //first we try to fetch all the admins and superadmins users from our database
        $userModel = new UserModel();
        $admins = $userModel->findAllAdmins();
        // if there are no admins or superadmin we return a message indicating that there are no users to sync
        if (empty($admins)) {
            return ['status' => 'success', 'there are no admins or superadmins to sync'];
        }

        // we cant just create users in keycloak without authentification, which is why we need to get an admin token before we send a post request to sync the admins
        $token = $this->getAdminToken();

        foreach ($admins as $admin) {
            // for each admin we check if the are already registerd in keycloack

            $existingUser = $this->getUserByEmail($admin->email, $token);

            // if the array is empty then we register the user in keycloack
            if (empty($existingUser)) {
                $this->createKeycloakAdmin($admin,$token);
                //after we register him we get his user id and assign him his role based on  the db
                $existingUser = $this->getUserByEmail($admin->email,$token);
                if (!empty($existingUser['id'])) {
                $this->assignUserRole($existingUser['id'], $admin->role, $token);
                } else {
                log_message('error', "Failed to retrieve Keycloak UUID for newly created user: {$admin->email}");
                }
            }
            else {
                //otherwise we update the admins so their enable status matches they deletion status
                //the same applies to their roles
                $this->setKeycloakUserEnabledStatus($existingUser['id'], !($admin->is_deleted), $token);
                $this->assignUserRole($existingUser['id'], $admin->role, $token);
            }
            
        }

        return ['status' => 'success', 'successfully synced all admins and superadmins to Keycloak'];
    }

    // helper functions
    // in this function we try to get the admin token to validate our requests
    public function getAdminToken(): string
    {
            // in here we verify our credentials by provide the client information and our admin account information
            $response = $this->client->post("{$this->baseUrl}/realms/{$this->realm}/protocol/openid-connect/token", [
                'form_params' => [
                    'client_id'  => env('keycloak_client_id'),
                    'client_secret' =>env('keycloak_client_secret'),
                    'grant_type' => 'client_credentials',
                ],'http_errors' => false
            ]);

        //we turn the response into an array so its easier to work with and we return the access token to use it in our requests
        $data = json_decode($response->getBody(), true);
        return $data['access_token'];
        

        
    }
    

    public function getUserByEmail(string $email, string $token)
    {   
        //first we prepare a request to get the user by email (we add exact and max to make sure find only the specific email we want)
        $url = "{$this->baseUrl}/admin/realms/{$this->realm}/users?email=" . urlencode($email). "&exact=true&max=1";

        // afterwards we send a get request to get the user if he exists
        $response = $this->client->get($url, [
            'headers' => ['Authorization' => "Bearer {$token}"],
            'http_errors' => false,
        ]);
        
        // we decode the response and turn it into an array
        $users = json_decode($response->getBody(), true);

        if (!empty($users)) {
            // if the user exists then we return the first occurrence of the user in the array, since the email is unique we can be sure that there will be only one user with that email
            return $users[0];
        }

        //otherwise we return null
        return null;
    }

    private function createKeycloakAdmin($admin,$token){
        // if the admin is soft deleted we dont create him in keycloak
        if ($admin->is_deleted){
            return;
        }
        $createUserUrl = "{$this->baseUrl}/admin/realms/{$this->realm}/users";

                $adminToRegister = [
                    'username'      => $admin->username,
                    'email'         => $admin->email,
                    'enabled'       => true,
                    'emailVerified' => true,
                    'credentials'   => [
                        [
                            //here we provide the password hash and the algorithm used to hash the password
                            'type'           => 'password',
                            'secretData'     => json_encode([
                                'value' => $admin->hash_password,
                                'salt'  => ''
                            ]),
                            // Direct Keycloak to use its BCrypt provider
                            'credentialData' => json_encode([
                                'algorithm'      => 'bcrypt',
                                'hashIterations' => 10
                            ]),
                        ]
                    ],
                    //we add the role of the user as an attribute so that we can differentate between admins and superadmins in keycloak
                    'attributes' => [
                        'local_role' => [$admin->role],
                    ],
                ];

                $this->client->post($createUserUrl, [
                    'headers' => [
                        'Authorization' => "Bearer {$token}",
                        'Content-Type'  => 'application/json',
                    ],
                    'http_errors' => false,
                    'json' => $adminToRegister,
                ]);

            return ['status' => 'success', 'successfully synced an admin with email: '.$admin->email];
    }

    private function setKeycloakUserEnabledStatus(string $keycloakUserId, bool $enabled, string $token): void
    {
        $url = "{$this->baseUrl}/admin/realms/{$this->realm}/users/{$keycloakUserId}";
        
        $this->client->put($url, [
            'headers' => [
                'Authorization' => "Bearer {$token}",
                'Content-Type'  => 'application/json',
            ],
            'http_errors' => false,
            'json' => ['enabled' => $enabled],
        ]);
    }

    //attaching a keycloak role to a user requires 2 steps
    public function  assignUserRole(string $keycloakUserId,string $rolename,string $token){
    // first figuring out the details of the role (and if it exists that is why we put it inside a try catch)
    try{
    $roleResponse = $this->client->get("{$this->baseUrl}/admin/realms/{$this->realm}/roles/{$rolename}", [
        'headers' => ['Authorization' => "Bearer {$token}"]
    ]);
    $roleData = json_decode($roleResponse->getBody(), true);
    }catch(Throwable $e){
        log_message('error', "Error mapping role '{$rolename}' to user '{$keycloakUserId}': " . $e->getMessage());
        return false;
    }
    //step 2 is to attach the role to the user
    try{
    $payload = [
            [
                'id'   => $roleData['id'],   // Keycloak Role UUID (REQUIRED)
                'name' => $roleData['name'], // Role name string (REQUIRED)
            ]
    ];
    $this->client->post("{$this->baseUrl}/admin/realms/{$this->realm}/users/{$keycloakUserId}/role-mappings/realm", [
        'headers' => [
            'Authorization' => "Bearer {$token}",
            'Content-Type'  => 'application/json',
        ],
        'http_errors' => false,
        'json' => $payload
    ]);
    }catch(Throwable $e){
        log_message('error', "Error mapping role '{$rolename}' to user '{$keycloakUserId}': " . $e->getMessage());
        return false;
    }
    }

    //this method is used to get all users who are currently authenticated and active in  the site
    public function getActiveUsers(): array
{   
    //getting all the active users requires 2 informations:
    // the admin token which we made a method to fetch from
    // the frontend client uuid since the users store their sessions inside the frontend client
    $token = $this->getAdminToken();
    if (!$token) return [];

    $clientUuid = env('KEYCLOAK_FRONTEND_CLIENT_UUID');
    $endpoint = "{$this->baseUrl}/admin/realms/{$this->realm}/clients/{$clientUuid}/user-sessions";

    //basically we we doing here is  fetching all the informations of the active users from the session by sending a request to the keycloak session endpoint
        $response = $this->client->get($endpoint, [
            'headers' => ['Authorization' => 'Bearer ' . $token]
        ]);
        return json_decode($response->getBody(), true);
   
}
    public function getSessionFromSessionId($id){
        $sessions = $this->getActiveUsers();

        foreach($sessions as $session){
            if ($session['id'] == $id){
                return $session;
            }
        }
        return null;
    }

}

