import {Form, FormInstance, Input, message, Modal} from 'antd';
import React from 'react';
import axios, {AxiosError} from 'axios';

interface IProps {
    onCancel: () => void,
    onOK: () => void,
    pipeline: string
}

interface IFieldError {
    property: string,
    errors: string[],
}

interface IState {
    showModal: boolean;
    formErrors: IFieldError[]
}

export class DevicesForm extends React.Component<IProps, IState> {
    form: React.RefObject<FormInstance>
    constructor(props: IProps) {
        super(props);
        this.form = React.createRef();
    }
    state = {
        showModal: false,
        formErrors: [
            {
                property: 'vendor',
                errors: []
            },
            {
                property: 'status',
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
        this.setState({
            formErrors: [
                {
                    property: 'vendor',
                    errors: []
                },
                {
                    property: 'status',
                    errors: []
                }
            ]
        });
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
            let formParams = this.form.current.getFieldsValue();
            formParams.pipeline = this.props.pipeline
            axios.post(process.env.REACT_APP_API_URL + '/devices', formParams)
                .then(response => {
                    message.success('The pipeline has been created');
                    this.close();
                    this.props.onOK();
                })
                .catch((error: AxiosError) => {
                    let errorMessage = 'There was an error creating the pipeline.';
                    if (error.response!.status === 400) {
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
                title={'Add Device'}
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
                        name="vendor"
                        label="Vendor"
                        rules={[{required: true, message: 'Please enter the vendor name!'}]}
                        validateStatus={this.getValidateStatus('vendor')}
                        help={this.getValidateMessage('vendor')}
                    >
                        <Input onChange={(e) => this.cleanValidationStatus('vendor')}/>
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{required: true, message: 'Please enter the status of the device!'}]}
                        validateStatus={this.getValidateStatus('status')}
                        help={this.getValidateMessage('status')}
                    >
                        <Input onChange={(e) => this.cleanValidationStatus('status')}/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}