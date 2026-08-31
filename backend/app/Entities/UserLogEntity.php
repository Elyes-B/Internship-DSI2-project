<?php

namespace App\Entities;

use CodeIgniter\Entity\Entity;

class UserLogEntity extends Entity
{
    protected $datamap = [];
    protected $dates   = [];
    protected $casts   = ['id'=>'int','userId'=>'string','username'=>'string','ipAddress'=>'string','url_called'=>'string','controller_method'=>'string','action_type'=>'string','user_agent'=>'string','created_at'=>'string'];
}
