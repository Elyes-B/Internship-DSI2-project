<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UserSession extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'VARCHAR',
                'constraint' => 255,
                'unique'     => true,
            ],
            'userId' => [
                'type'           => 'VARCHAR',
                'constraint' => 255,
                'null'=>false
            ],
            'username' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
                'null'=>false
            ],
            'ipAddress' => [
                'type'   => 'VARCHAR',
                'constraint' => 255,
            ],
            'start' => [
                'type' => 'DATETIME',
            ],
            'lastAccess' => [
                'type' => 'DATETIME',
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('username', 'users', 'username', 'CASCADE');
        $this->forge->createTable('users_session');
    }

    public function down()
    {
        $this->forge->dropTable('user_sessions', true);
    }
}
