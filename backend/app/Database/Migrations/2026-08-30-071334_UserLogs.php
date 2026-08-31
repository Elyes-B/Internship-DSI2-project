<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;


class UserLogs extends Migration
{
    public function up()
    {
         $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'unsigned'       => true,
                'auto_increment' => true,
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
            'url_called' => [
                 'type'   => 'VARCHAR',
                'constraint' => 255,
            ],
            'controller_method' => [
                 'type'   => 'VARCHAR',
                'constraint' => 255,
            ],
            'action_type' => [
                 'type'   => 'VARCHAR',
                'constraint' => 10,
            ],
            'user_agent' => [
                 'type'   => 'VARCHAR',
                'constraint' => 255,
            ],
            'created_at' => [
            'type' => 'DATETIME',
            'null' => true,
            ],
            

        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('username', 'users', 'username', 'CASCADE');
        $this->forge->createTable('users_log');
    }

    public function down()
    {
        $this->forge->dropTable('users_log', true);
    }
}
