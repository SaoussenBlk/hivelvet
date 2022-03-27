/**
 * Hivelvet open source platform - https://riadvice.tn/
 *
 * Copyright (c) 2022 RIADVICE SUARL and by respective authors (see below).
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

import { Component } from 'react';
import Icon, * as AntdIcons from '@ant-design/icons';

type Props = {
    type: string;
    className?: string;
};
type State = {};

class DynamicIcon extends Component<Props, State> {
    render() {
        const { type, className } = this.props;
        const hivelvetIcons: string[] = [
            'mp4',
            'room',
            'zcaleright',
            'role',
            'general-settings',
            'bigbluebutton',
            'playback-presentation',
            'playback-podcast',
            'activity-reports',
            'preset',
        ];

        if (hivelvetIcons.includes(type.toLowerCase())) {
            const hivelvetIcon = () => <span className={'icon-hivelvet-' + type.toLowerCase()} />;
            return <Icon component={hivelvetIcon} className={className} />;
        } else {
            const AntdIcon: any = AntdIcons[type as keyof typeof AntdIcons];
            return <AntdIcon className={className} />;
        }
    }
}

export default DynamicIcon;
