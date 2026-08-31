<?php

namespace App\Filters;

use App\Libraries\UserLoggerService;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;
use Firebase\JWT\JWT;

class AuthFilter implements FilterInterface
{
    /**
     * Do whatever processing this filter needs to do.
     * By default it should not return anything during
     * normal execution. However, when an abnormal state
     * is found, it should return an instance of
     * CodeIgniter\HTTP\Response. If it does, script
     * execution will end and that Response will be
     * sent back to the client, allowing for error pages,
     * redirects, etc.
     *
     * @param RequestInterface $request
     * @param array|null       $arguments
     *
     * @return RequestInterface|ResponseInterface|string|void
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        // we first get the auth token from keycloak provided by the interceptor service
        $token = $request->getHeaderLine('Authorization');

        // if the user dosent have a token that means he is not authenticated meaning his request is invalid
        if(empty($token)){
            return Services::response()
            ->setStatusCode(401)
            ->setJSON([
                'message' => 'unauthorized request detected, missing valid token'
            ]);
        }

        //JWT  tokens need to be sparated using expode, so can fetch the data
        $tokenData = explode('.', $token);
        // i used firebase dependency for decoding
        $tokenData = JWT::urlsafeB64Decode($tokenData[1]);
        $data = json_decode($tokenData,true);
        // if the token is invalid we quit the method
        if(empty($data)){
            return Services::response()
            ->setStatusCode(401)
            ->setJSON([
                'message' => 'token decoding error'
            ]);
        }
        //otherwise we start the process of gathering the log info and saving it
        $userLogger =new UserLoggerService();
        
        $userLogger->gatherLogData($data);
    }

    /**
     * Allows After filters to inspect and modify the response
     * object as needed. This method does not allow any way
     * to stop execution of other after filters, short of
     * throwing an Exception or Error.
     *
     * @param RequestInterface  $request
     * @param ResponseInterface $response
     * @param array|null        $arguments
     *
     * @return ResponseInterface|void
     */
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        //
    }
}
