/**
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

import React from 'react';
import { Trans } from 'react-i18next';

import { Button, Form, Typography, Card, Modal, Switch, Alert, Tooltip } from 'antd';
import DynamicIcon from './DynamicIcon';

import LocaleService from '../services/locale.service';

import { PresetType } from '../types/PresetType';
import { SubCategoryType } from '../types/SubCategoryType';
import { getIconName } from '../types/GetIconName';

const { Title, Paragraph } = Typography;
const { Grid, Meta } = Card;

type Props = {
    presets: PresetType[];
    onFinish?: (category: string, subCategories: SubCategoryType[]) => void;
    enabled?: boolean;
};

export const Step3Form = (props: Props) => {
    const { presets } = props;
    const enabled = props.enabled ?? true;
    const [modalTitle, setModalTitle] = React.useState<string>('');
    const [modalContent, setModalContent] = React.useState<SubCategoryType[]>([]);
    const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);

    const showModal = (title: string, content: SubCategoryType[]) => {
        setIsModalVisible(true);
        setModalTitle(title);
        setModalContent(content);
    };
    const Confirm = () => {
        if (props.onFinish) {
            props.onFinish(modalTitle, modalContent);
        }
        setIsModalVisible(false);
    };

    const getSubCategoryName = (name: string) => {
        return name.charAt(0).toUpperCase() + name.replaceAll('_', ' ').slice(1);
    };

    return (
        <>
            <Paragraph className="final-form-header">
                <Title level={4} className="final-form-header">
                    <Trans i18nKey="bigbluebutton_rooms_settings" />
                </Title>

                <Alert
                    className="settings-info"
                    message={<Trans i18nKey="customize_configuration" />}
                    type="warning"
                    closeText={<Trans i18nKey="understand" />}
                />
            </Paragraph>
            <Card bordered={false}>
                {presets.map((item) => (
                    <Tooltip
                        key={item.name}
                        placement={LocaleService.direction == 'rtl' ? 'leftTop' : 'rightTop'}
                        overlayClassName="install-tooltip"
                        title={
                            <ul>
                                {item.subcategories.map((subItem) => {
                                    const subcategory = getSubCategoryName(subItem.name);

                                    return (
                                        <li
                                            key={item.name + '_' + subItem.name}
                                            className={subItem.enabled == true ? 'text-black' : 'text-grey'}
                                        >
                                            {subcategory}
                                        </li>
                                    );
                                })}
                            </ul>
                        }
                    >
                        <Grid
                            key={item.name}
                            className="presets-grid"
                            onClick={() => (enabled ? showModal(item.name, item.subcategories) : null)}
                        >
                            <Meta
                                avatar={<DynamicIcon type={getIconName(item.name)} className="PresetIcon" />}
                                title={item.name}
                            />
                        </Grid>
                    </Tooltip>
                ))}

                {enabled && (
                    <Modal
                        title={modalTitle}
                        className="presets-modal"
                        centered
                        open={isModalVisible}
                        onOk={() => setIsModalVisible(false)}
                        onCancel={() => setIsModalVisible(false)}
                        footer={[
                            <Button key="submit" type="primary" onClick={Confirm}>
                                <Trans i18nKey="confirm" />
                            </Button>,
                        ]}
                    >
                        <div className="presets-body">
                            {modalContent.map((item) => {
                                const subcategory = getSubCategoryName(item.name);

                                return (
                                    <div key={modalTitle + '_' + item.name}>
                                        <Form.Item label={subcategory} valuePropName={item.name}>
                                            <Switch
                                                defaultChecked={item.enabled == true ? true : false}
                                                onChange={(checked) => {
                                                    item.enabled = checked;
                                                }}
                                            />
                                        </Form.Item>
                                    </div>
                                );
                            })}
                        </div>
                    </Modal>
                )}
            </Card>
        </>
    );
};
