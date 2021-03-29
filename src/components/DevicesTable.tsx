import {Button, Descriptions, Popconfirm, Space, Table, message} from 'antd';
import React from 'react';
import axios from 'axios';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {HomeOutlined, PlusOutlined, ReloadOutlined} from '@ant-design/icons';
import {DevicesForm} from './DevicesForm';

interface IProps extends RouteComponentProps<any> {
    pipelineId: string;
}

interface IPipeline {
    _id: string;
    name: string;
    serialNumber: string;
    ipv4: string;
    devices: IDevice[]
}

interface IDevice {
    _id: number,
    pipeline: string,
    vendor: string,
    status: string,
    createdAt: string
}

interface IPipelineResponse {
    data: IPipeline,
    message: string
}

interface IState {
    data: IPipeline,
    loading: boolean,
}


class DevicesTable extends React.Component<IProps, IState> {
    createForm: React.RefObject<DevicesForm>
    columns = [
        {
            title: 'Device ID',
            dataIndex: '_id',
            sorter: (a: IDevice , b: IDevice) => {
                if (a._id > b._id) return 1;
                else if(b._id > a._id) return -1;
                return 0;
            },
            width: '10%',
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor',
            sorter: (a: IDevice , b: IDevice) => a.vendor.localeCompare(b.vendor),
            width: '25%',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            sorter: (a: IDevice , b: IDevice) => a.status.localeCompare(b.status),
            width: '20%',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            sorter: (a: IDevice , b: IDevice) => a.createdAt.localeCompare(b.createdAt),
            width: '20%'
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: IDevice) => (
                <Space size="middle">
                    <Popconfirm
                        key={record._id}
                        title="Delete Pipeline"
                        onConfirm={() => {this.deleteDevice(record._id)}}
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];
    state = {
        data: {
            _id: '',
            name: '',
            serialNumber: '',
            ipv4: '',
            devices: []
        },
        loading: false,
    };

    constructor(props: IProps) {
        super(props);
        this.createForm = React.createRef();
    }

    componentDidMount() {
        this.fetchPipelineData();
        document.title = 'Devices';
    }

    deleteDevice = (deviceID: number) => {
        axios.delete(process.env.REACT_APP_API_URL + '/devices/' + deviceID)
            .then(response => {
                message.success('The device has been removed.');
                this.fetchPipelineData();
            })
            .catch(error => {
                message.error('There was an error deleting the device')
            })
    }
    fetchPipelineData = () => {
        this.setState({ loading: true });
        console.log(this.props);
        axios.get<IPipelineResponse>(process.env.REACT_APP_API_URL + '/pipelines/' + this.props.match.params.pipelineId)
            .then((response) => {
                const {data} =  response.data;
                this.setState({
                    loading: false,
                    data: data
                });
            }).catch(error => {
            this.setState({
                data: {
                    _id: '',
                    name: '',
                    serialNumber: '',
                    ipv4: '',
                    devices: []
                },
                loading: false,
            });
            console.log(error);
        })
    };

    showCreateForm = () => {
        if (this.createForm.current) {
            this.createForm.current.open();
        }
    }

    render() {
        const { data, loading } = this.state;
        return (
            <>
                <Descriptions title='PIPELINE DETAILS' bordered>
                    <Descriptions.Item label="Name">{this.state.data.name}</Descriptions.Item>
                    <Descriptions.Item label="Serial Number">{this.state.data.serialNumber}</Descriptions.Item>
                    <Descriptions.Item label="IP V4">{this.state.data.ipv4}</Descriptions.Item>
                </Descriptions>
                <Space align={'end'} style={{ marginBottom: 16, marginTop: 16, width: '100%' }}>
                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={() => {this.fetchPipelineData()}}
                    >
                        Refresh
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {this.showCreateForm()}}
                    >
                        Add Device
                    </Button>
                    <Button
                        type="primary"
                        icon={<HomeOutlined />}
                        href={'/'}
                    >
                        Back to Pipelines List
                    </Button>
                </Space>
                <DevicesForm
                    pipeline={this.props.match.params.pipelineId}
                    key={'createForm'}
                    ref={this.createForm}
                    onCancel={() => {}}
                    onOK={this.fetchPipelineData}
                />
                <Table
                    columns={this.columns}
                    dataSource={data.devices}
                    loading={loading}
                    style={{width: '100%'}}
                    onChange={this.fetchPipelineData}
                    scroll={{ y: 'calc(100vh - 28em)' }}
                    bordered
                />
            </>
        );
    }
}

export default withRouter(DevicesTable);