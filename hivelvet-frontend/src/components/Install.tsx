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

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import InstallService from '../services/install.service';

import { Steps, Button, Row, Col, Form, Result } from 'antd';
import DynamicIcon from './DynamicIcon';
import axios from 'axios';
import { Trans, useTranslation, withTranslation } from 'react-i18next';

import { Step1Form } from './Step1Form';
import { Step2Form } from './Step2Form';
import { Step3Form } from './Step3Form';

import { UploadFile } from 'antd/lib/upload/interface';

const API_URL = process.env.REACT_APP_API_URL;
const { Step } = Steps;

type settingsType = {
    company_name?: string;
    company_website?: string;
    platform_name?: string;
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
    additional_color?: string;
};
type subCategoryType = {
    name: string;
    status: boolean;
};
type presetType = {
    name: string;
    icon: string;
    subcategories: subCategoryType[];
};
type stepType = {
    title: string;
    content: JSX.Element;
    button: string;
    span: number;
    offset: number;
};
type formType = {
    username: string;
    email: string;
    password: string;
    company_name: string;
    company_url: string;
    platform_name: string;
    term_url: string;
    policy_url: string;
    branding_colors: {
        primary_color: string;
        secondary_color: string;
        accent_color: string;
        add_color: string;
    };
    presetsConfig: presetType[];
};

const Install = () => {
    const { t } = useTranslation();

    const [stepForm] = Form.useForm();
    const initialValues: formType = {
        username: '',
        email: '',
        password: '',

        company_name: '',
        company_url: '',
        platform_name: '',
        term_url: '',
        policy_url: '',
        branding_colors: {
            primary_color: '',
            secondary_color: '',
            accent_color: '',
            add_color: '',
        },

        presetsConfig: [],
    };

    const [activeStep, setActiveStep] = React.useState<number>(0);
    const [successful, setSuccessful] = React.useState<boolean>(false);

    const [primaryColor, setPrimaryColor] = React.useState<string>('');
    const [secondaryColor, setSecondaryColor] = React.useState<string>('');
    const [accentColor, setAccentColor] = React.useState<string>('');
    const [addColor, setAddColor] = React.useState<string>('');
    const [file, setFile] = React.useState<UploadFile>(null);
    const [fileList, setFileList] = React.useState<UploadFile[]>(null);

    const [presets, setPresets] = React.useState<presetType[]>([]);

    useEffect(() => {
        InstallService.collect_settings()
            .then((response) => {
                const settings: settingsType = response.data;
                if (settings) {
                    stepForm.setFieldsValue({
                        company_name: settings.company_name,
                        company_url: settings.company_website,
                        platform_name: settings.platform_name,
                    });
                    setPrimaryColor(settings.primary_color);
                    setSecondaryColor(settings.secondary_color);
                    setAccentColor(settings.accent_color);
                    setAddColor(settings.additional_color);
                }
            })
            .catch((error) => {
                console.log(error);
            });
        InstallService.collect_presets()
            .then((response) => {
                setPresets(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    function next() {
        const nextStep: number = activeStep + 1;
        setActiveStep(nextStep);
    }
    function prev() {
        const prevStep: number = activeStep - 1;
        setActiveStep(prevStep);
    }

    const steps: stepType[] = [
        {
            title: t('administrator_account'),
            content: <Step1Form />,
            button: t('create'),
            span: 8,
            offset: 4,
        },
        {
            title: t('company.label') + ' & ' + t('branding'),
            content: (
                <Step2Form
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    accentColor={accentColor}
                    addColor={addColor}
                    setPrimaryColor={setPrimaryColor}
                    setSecondaryColor={setSecondaryColor}
                    setAccentColor={setAccentColor}
                    setAddColor={setAddColor}
                    setFile={setFile}
                    fileList={fileList}
                    setFileList={setFileList}
                />
            ),
            button: t('next'),
            span: 15,
            offset: 2,
        },
        {
            title: t('bigBlueButton_settings'),
            content: <Step3Form presets={presets} />,
            button: t('finish'),
            span: 18,
            offset: 1,
        },
    ];

    const onFinish = () => {
        if (activeStep < steps.length - 1) {
            next();
        } else {
            const formData: formType = stepForm.getFieldsValue(true);
            formData.branding_colors = {
                primary_color: primaryColor,
                secondary_color: secondaryColor,
                accent_color: accentColor,
                add_color: addColor,
            };
            formData.presetsConfig = presets;
            InstallService.install(formData)
                .then(() => {
                    setSuccessful(true);
                })
                .catch((error) => {
                    console.log(error.response.data);
                });
            if (file != undefined) {
                const fdata: FormData = new FormData();
                fdata.append('logo', file.originFileObj, file.originFileObj.name);
                fdata.append('logo_name', file.originFileObj.name);
                axios
                    .post(API_URL + '/save-logo', fdata)
                    .then((response) => {
                        console.log(response);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
    };

    return (
        <Row>
            {successful ? (
                <Col span={10} offset={7} className="section-top">
                    <Result
                        status="success"
                        icon={<DynamicIcon type="CheckOutlined" className="success-install-icon" />}
                        title={<Trans i18nKey="success_install" />}
                        extra={
                            <Link to={'/login'} className="ant-btn ant-btn-primary ant-btn-lg">
                                <Trans i18nKey="start-using-hivelvet" />
                            </Link>
                        }
                    />
                </Col>
            ) : (
                <>
                    <Col span={4}>
                        <Steps className="install-steps" size="small" direction="vertical" current={activeStep}>
                            {steps.map((item) => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>
                    </Col>
                    <Col span={steps[activeStep].span} offset={steps[activeStep].offset}>
                        <Form
                            layout="vertical"
                            name="install_form"
                            className="install-form steps-content"
                            form={stepForm}
                            initialValues={initialValues}
                            requiredMark={false}
                            scrollToFirstError={true}
                            validateTrigger="onSubmit"
                            onFinish={onFinish}
                        >
                            {steps[activeStep].content}
                            <Form.Item
                                className={
                                    activeStep === steps.length - 1
                                        ? 'button-container final-step-btn'
                                        : 'button-container'
                                }
                            >
                                {activeStep > 0 && (
                                    <Button className="prev" onClick={() => prev()} block>
                                        <Trans i18nKey="previous" />
                                    </Button>
                                )}
                                {activeStep <= steps.length - 1 && (
                                    <Button type="primary" htmlType="submit" block>
                                        {steps[activeStep].button}
                                    </Button>
                                )}
                            </Form.Item>
                        </Form>
                    </Col>
                </>
            )}
        </Row>
    );
};

export default withTranslation()(Install);
