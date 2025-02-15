<?php

declare(strict_types=1);

/*
 * Hivelvet open source platform - https://riadvice.tn/
 *
 * Copyright (c) 2022-2023 RIADVICE SUARL and by respective authors (see below).
 *
 * This program is free software; you can redistribute it and/or modify it under the
 * terms of the GNU Lesser General Public License as published by the Free Software
 * Foundation; either version 3.0 of the License, or (at your option) any later
 * version.
 *
 * Hivelvet is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License along
 * with Hivelvet; if not, see <http://www.gnu.org/licenses/>.
 */

use Phinx\Migration\AbstractMigration;

class CreateUsersTables extends AbstractMigration
{
    public function up(): void
    {
        $table = $this->table('users');
        $table->addColumn('email', 'string', ['limit' => 256, 'null' => false])
            ->addColumn('username', 'string', ['limit' => 32, 'null' => false])
            ->addColumn('role_id', 'integer', ['null' => true])
            ->addColumn('password', 'string', ['limit' => 256, 'null' => false])
            ->addColumn('status', 'string', ['limit' => 32, 'default' => 'inactive', 'null' => false])
            ->addColumn('last_login', 'datetime', ['default' => '0001-01-01 00:00:00', 'timezone' => true])
            ->addColumn('created_on', 'datetime', ['default' => '0001-01-01 00:00:00', 'timezone' => true])
            ->addColumn('updated_on', 'datetime', ['default' => '0001-01-01 00:00:00', 'timezone' => true])
            ->addColumn('password_attempts', 'integer', ['default' => 3, 'null' => false])
            ->addIndex('username', ['unique' => true, 'name' => 'idx_users_username'])
            ->addIndex('email', ['unique' => true, 'name' => 'idx_users_email'])
            ->addForeignKey(['role_id'], 'roles', ['id'], ['constraint' => 'user_role_id'])
            ->save()
        ;
    }

    public function down(): void
    {
        $this->table('users')->drop()->save();
    }
}
