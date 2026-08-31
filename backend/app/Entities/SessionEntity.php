<?php

namespace App\Entities;

use CodeIgniter\Entity\Entity;

class SessionEntity extends Entity
{
    protected $datamap = [];
    protected $dates   = ['start','lastAccess'];
    protected $casts   = ['id'=>'string','userId'=>'string','username'=>'string','ipAddress'=>'string'];
}
