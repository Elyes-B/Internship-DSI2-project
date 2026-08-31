<?php

namespace App\Models;

use CodeIgniter\Model;
use App\Entities\User;
use App\Libraries\KeycloakAdminService;

class UserModel extends Model
{


    protected $table            = 'users';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = User::class;
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['username', 'email', 'password','role', 'created_at', 'updated_at', 'is_deleted'];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected array $casts = [];
    protected array $castHandlers = [];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'is_deleted';

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $afterInsert    = ['syncAllAdmins'];
    protected $afterUpdate    = ['syncAllAdmins'];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = ['syncAllAdmins'];

    //methods
    public function syncAllAdmins(array $data){
        service('keycloakAdmin')->syncAllAdmins();

        return $data;
    }

    //search for ALL active admins
    public function findAllActiveAdmins(){
        return $this->where('is_deleted', 0)
                            ->whereIn('role', ['admin', 'superadmin'])
                            ->findAll();
    }

    //search for ALL admins (active or inactive)
    public function findAllAdmins(){
        return $this->whereIn('role', ['admin', 'superadmin'])
                    ->findAll();
    }

}
