import {Form, FormInstance, Input, message, Modal} from 'antd';
import React from 'react';
import axios, {AxiosError} from 'axios';

interface IProps {
    onCancel: () => void,
    onOK: () => void
}

interface IFieldError {
    property: string,
    errors: string[],
}

interface IState {
    showModal: boolean;
    formErrors: IFieldError[]
}

export class PipelineForm extends React.Component<IProps, IState> {
    form: React.RefObject<FormInstance>
    constructor(props: IProps) {
        super(props);
        this.form = React.createRef();
    }
    state = {
        showModal: false,
        formErrors: [
            {
                property: 'serialNumber',
                errors: []
            },
            {
                property: 'name',
                errors: []
            },
            {
                property: 'ipv4',
                errors: []
            }
        ]
    };
    close = () => {
        this.setState({showModal: false})
    };

    open = () => {
        this.setState({showModal: true})
    };

    clearErrors = () => {
        this.setState({formErrors: [
                {
                    property: 'serialNumber',
                    errors: []
                },
                {
                    property: 'name',
                    errors: []
                },
                {
                    property: 'ipv4',
                    errors: []
                }
            ]});
    }

    getValidateStatus = (fieldName: string): ''| 'error' => {
        const element = this.state.formErrors.find(element => element.property === fieldName);
        return typeof element !== 'undefined' && element.errors!.length > 0 ? 'error' : '';
    }

    getValidateMessage = (fieldName: string) => {
        const element = this.state.formErrors.find(element => element.property === fieldName);
        if (typeof element !== 'undefined' && element.errors!.length > 0) {
            return element.errors[0];
        }
        return '';
    }

    cleanValidationStatus = (fieldName: string) => {
        const updatedState = this.state.formErrors.map(element => {
            if (element.property === fieldName) {
                element.errors = [];
            }
            return element;
        });
        this.setState({
            formErrors: updatedState
        });
    }


    onAccept = (values: any) => {
        if(this.form.current) {
            axios.post(process.env.REACT_APP_API_URL + '/pipelines', this.form.current.getFieldsValue())
                .then(response => {
                    message.success('The pipeline has been created');
                    this.close();
                    this.props.onOK();
                })
                .catch((error: AxiosError) => {
                    let errorMessage = 'There was an error creating the pipeline.';
                    let status = error.response!.status;
                    if (status === 400 || 409) {
                        const {data} = error.response!.data;
                        if (error.response!.data.message) {
                            errorMessage = error.response!.data.message;
                        }
                        if (data) {
                            this.setState({
                                formErrors: data.map((errorData: any) => ({
                                    property: errorData.property,
                                    errors: errorData.message
                                }))
                            });
                        }
                    }
                    console.log(error)
                    message.error(errorMessage);
                });
        }
    }


    render() {
        return (
            <Modal
                visible={this.state.showModal}
                title={'Create new Pipeline'}
                okText="Create"
                cancelText="Cancel"
                onCancel={this.close}
                onOk={this.onAccept}
            >
                <Form
                    ref={this.form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{modifier: 'public'}}
                >
                    <Form.Item
                        name="serialNumber"
                        label="Serial Number"
                        rules={[{required: true, message: 'Please input the serial number!'}]}
                        validateStatus={this.getValidateStatus('serialNumber')}
                        help={this.getValidateMessage('serialNumber')}
                    >
                        <Input onChange={(e) => this.cleanValidationStatus('serialNumber')}/>
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{required: true, message: 'Please enter the Name!'}]}
                        validateStatus={this.getValidateStatus('name')}
                        help={this.getValidateMessage('name')}
                    >
                        <Input onChange={(e) => this.cleanValidationStatus('name')}/>
                    </Form.Item>
                    <Form.Item
                        name="ipv4"
                        label="IP Address"
                        rules={[{required: true, message: 'Please enter the IP address!'}]}
                        validateStatus={this.getValidateStatus('ipv4')}
                        help={this.getValidateMessage('ipv4')}
                    >
                        <Input type="text" minLength={7} maxLength={15}
                               pattern="^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$"
                               onChange={(e) => this.cleanValidationStatus('ipv4')}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}