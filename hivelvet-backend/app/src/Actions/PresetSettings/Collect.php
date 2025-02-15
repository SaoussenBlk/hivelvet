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

namespace Actions\PresetSettings;

use Actions\Base as BaseAction;
use Actions\RequirePrivilegeTrait;
use Models\PresetSetting;

/**
 * Class Collect.
 */
class Collect extends BaseAction
{
    use RequirePrivilegeTrait;

    /**
     * @param \Base $f3
     * @param array $params
     */
    public function execute($f3, $params): void
    {
        $presetSetting = new PresetSetting();
        // install process
        if (null !== $f3->get('config.extension')) {
            $data = $presetSetting->getDefaultPresetSettings();
        } else {
            $data = $presetSetting->collectAll();
        }

        $this->logger->debug('collecting preset settings', ['data' => json_encode($data)]);
        $this->renderJson($data);
    }
}
