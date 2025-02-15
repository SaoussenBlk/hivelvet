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

final class AddDefaultSettingsRecord extends AbstractMigration
{
    public function up(): void
    {
        $table        = $this->table('settings');
        $defaultColor = '#fbbc0b';
        $data         = [
            [
                'company_name'     => 'RIADVICE',
                'company_website'  => 'https://riadvice.tn',
                'platform_name'    => 'Hivelvet',
                'primary_color'    => $defaultColor,
                'secondary_color'  => $defaultColor,
                'accent_color'     => $defaultColor,
                'additional_color' => $defaultColor,
                'created_on'       => date('Y-m-d H:i:s'),
            ],
        ];

        $table->insert($data)->save();
    }

    public function down(): void
    {
        $table = $this->table('settings');
        $table->getAdapter()->execute("DELETE from settings where company_name='RIADVICE'");
    }
}
