<?php

namespace Tests;

use App\Models\UserModel;
use CodeIgniter\CLI\CLI;
use CodeIgniter\Test\CIUnitTestCase;

class UserModelTest extends CIUnitTestCase
{
    
    protected function setUp(): void
    {
        parent::setUp();
    }

    public function testExample(): void
    {
        
        CLI::write("\n--- Starting Keycloak Model Sync Test ---", 'yellow');

        $userModel = new UserModel();
        
        // Generate dynamic credentials to avoid MySQL unique key collisions
        $uniqueId = time();
        $testUsername = 'cb_user_' . $uniqueId;
        $testEmail    = 'cb_verify_' . $uniqueId . '@example.com';

        // 1. Insert admin record -> triggers $afterInsert -> calls syncToKeycloak()
        CLI::write("-> 1. Inserting admin user ($testUsername / $testEmail)...", 'cyan');
        $id = $userModel->insert([
            'username'   => $testUsername,
            'email'      => $testEmail,
            'password'   => password_hash('Secret123!', PASSWORD_BCRYPT),
            'role'       => 'admin',
            'created_at' => date('Y-m-d H:i:s'),
        ]);

        $this->assertIsNumeric($id);

        // 2. QUERY KEYCLOAK DIRECTLY to prove the callback synced the user!
        CLI::write("-> 2. Querying Keycloak Admin API to verify user creation...", 'cyan');
        $keycloakService = service('keycloakAdmin');
        $token = $keycloakService->getAdminToken();
        
        // Fetch user from Keycloak using your service helper
        $keycloakUser = $keycloakService->getUserByEmail($testEmail,$token);

        // Real Assertions: If $keycloakUser is empty, the callback failed!
        $this->assertNotEmpty(
            $keycloakUser, 
            "FAIL: User inserted in MySQL, but model callback failed to create user in Keycloak!"
        );
        $this->assertEquals($testEmail, $keycloakUser['email']);

        CLI::write("-> SUCCESS: User found in Keycloak with ID: {$keycloakUser['id']}", 'green');

        // 3. Clean up database record (Hard delete to prevent clutter)
        CLI::write("-> 3. Cleaning up test record from MySQL...", 'cyan');
        $userModel->delete($id, true);

        CLI::write("--- Keycloak Sync Test Passed! ---\n", 'green');
    }
}
