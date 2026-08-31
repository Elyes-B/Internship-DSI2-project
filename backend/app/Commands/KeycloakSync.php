<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class KeycloakSync extends BaseCommand
{
    /**
     * The Command's Group
     *
     * @var string
     */
    protected $group = 'keycloak';

    /**
     * The Command's Name
     *
     * @var string
     */
    protected $name = 'keycloak:sync';

    /**
     * The Command's Description
     *
     * @var string
     */
    protected $description = 'this command is used to either create admins inside of keycloak or to update their access status';

    /**
     * The Command's Usage
     *
     * @var string
     */
    protected $usage = 'keycloak:sync';

    /**
     * The Command's Arguments
     *
     * @var array
     */
    protected $arguments = [];

    /**
     * The Command's Options
     *
     * @var array
     */
    protected $options = [];

    /**
     * Actually execute a command.
     *
     * @param array $params
     */
    public function run(array $params)
    {
        CLI::write('Starting Keycloak admin synchronization...', 'yellow');

        try {
            // Instantiate or call the service library
            $keycloakService = service('keycloakAdmin');
            
            $result = $keycloakService->syncAllAdmins();

            if ($result['status'] === 'success') {
                $message = $result['message'] ?? $result[0] ?? 'Synchronization completed successfully.';
                CLI::write("SUCCESS: {$message}", 'green');
            } else {
                CLI::write('WARNING: Sync completed with unexpected status.', 'light_red');
            }
        } catch (\Throwable $e) {
            CLI::error('ERROR: Failed to synchronize admins with Keycloak.');
            CLI::write($e->getMessage(), 'red');
        }
    }
}
