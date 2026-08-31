<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use Faker\Factory;
use App\Models\UserModel;

class UserSeeder extends Seeder
{
    public function run()
    {
        $faker = Factory::create();
        $userModel = new UserModel();

        $roles = ['user','admin','superadmin'];

        for ($i = 0; $i < 10; $i++) {
            $data = [
                'username' => $faker->userName,
                'email' => $faker->email,
                'password' => password_hash('password', PASSWORD_DEFAULT),
                'role' => $faker->randomElement($roles)
            ];

            $userModel->insert($data);
        }
    }
}
