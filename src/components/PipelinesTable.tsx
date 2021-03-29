import {Button, Space, Table, message, Descriptions, Popconfirm} from 'antd';
import React from 'react';
import axios from 'axios';
import {PlusOutlined, ReloadOutlined} from '@ant-design/icons';
import {PipelineForm} from './PipelinesForm';
import { Breakpoint } from 'antd/lib/_util/responsiveObserve';

interface IPipeline {
    _id: string;
    name: string;
    serialNumber: string;
    ipv4: string;
}

interface IPipelineResponse {
    data: IPipeline[],
    message: string
}

interface IProps {}
interface IState {
    data: IPipeline[],
    loading: boolean,
    showForm: boolean
}

export class PipelinesTable extends React.Component<IProps, IState> {
    createForm: React.RefObject<PipelineForm>
    state = {
        data: [],
        loading: false,
        showForm: false
    };

    columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            sorter: (a: IPipeline , b: IPipeline) => a._id.localeCompare(b._id),
        },
        {
            title: 'Serial Number',
            dataIndex: 'serialNumber',
            sorter: (a: IPipeline , b: IPipeline) => {
                const snA: number = +a.serialNumber;
                const snB: number = +b.serialNumber;
                if (snA > snB) return 1;
                else if(snB > snA) return -1;
                return 0;
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a: IPipeline , b: IPipeline) => a.name.localeCompare(b.name),
            responsive: ['md'] as Breakpoint[],
        },
        {
            title: 'IP v4',
            dataIndex: 'ipv4',
            sorter: (a: IPipeline , b: IPipeline) => a.ipv4.localeCompare(b.ipv4),
            responsive: ['md'] as Breakpoint[],
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: IPipeline) => (
                <Space size="middle">
                    <Button href={'/pipeline/' + record._id}>View Details</Button>
                    <Popconfirm
                        key={record._id}
                        title="Delete Pipeline"
                        onConfirm={() => {this.deletePipeline(record._id)}}
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Space>
            )

        }
    ];

    constructor(props: IProps) {
        super(props);
        this.createForm = React.createRef();
    }

    componentDidMount() {
        this.fetchPipelinesData();
        document.title = 'Pipelines';
    }

    deletePipeline = (pipelineID: string) => {
        axios.delete(process.env.REACT_APP_API_URL + '/pipelines/' + pipelineID)
            .then(response => {
                message.success('The pipeline has been removed.');
                this.fetchPipelinesData();
            })
            .catch(error => {
                message.error('There was an error deleting the pipeline')
            })
    }

    fetchPipelinesData = () => {
        this.setState({ loading: true });
        axios.get<IPipelineResponse>(process.env.REACT_APP_API_URL + '/pipelines')
            .then((response) => {
                const {data} =  response.data;
                this.setState({
                    loading: false,
                    data
                });
            }).catch(error => {
                this.setState({
                    loading: false,
                    data: [],
                });
            message.error({
                content: 'There was an error loading the pipelines.',
                className: 'custom-class',
                style: {
                    marginTop: '20vh',
                },
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
                <Descriptions title='PIPELINES LIST' bordered>
                </Descriptions>
                <Space align={'start'} style={{ marginBottom: 16, width: '100%' }}>
                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={() => {this.fetchPipelinesData()}}
                    >
                        Refresh
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {this.showCreateForm()}}
                    >
                        Add Pipeline
                    </Button>
                </Space>
                <PipelineForm
                    key={'createForm'}
                    ref={this.createForm}
                    onCancel={() => {}}
                    onOK={this.fetchPipelinesData}/>
                <Table
                    columns={this.columns}
                    dataSource={data}
                    loading={loading}
                    tableLayout={'auto'}
                    scroll={{ y: 'calc(100vh - 28em)' }}
                    bordered
                />
            </>
        );
    }
}