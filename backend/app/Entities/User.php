<?php

namespace App\Entities;

use CodeIgniter\Entity\Entity;

class User extends Entity
{
    protected $dates   = ['created_at'=>'datetime', 'updated_at'=>'datetime'];
    protected $casts   = ['id' => 'integer', 'username' => 'string', 'email' => 'string', 'password' => 'string', 'is_deleted' => 'boolean'];


}
