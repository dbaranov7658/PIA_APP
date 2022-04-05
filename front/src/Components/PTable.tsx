import * as React from "react";
import '../CSS/App.css';
import '../CSS/PTable.css';
import {Row, Table, Button, Tag, Tooltip, Popconfirm, message, Skeleton, Col, Input} from 'antd';
// @ts-ignore
import {Link} from "react-router-dom";
import {piaInfo} from "../interfaces";
import {tableData} from "../interfaces";
import {DeleteOutlined, PrinterOutlined} from "@ant-design/icons";
import { SearchOutlined, CopyOutlined } from '@ant-design/icons';
// @ts-ignore
import {encrypted} from "./Main.tsx";
// @ts-ignore
import {apiCall} from "../API/api.tsx";
import Search from "antd/es/input/Search";


const LoadingButton = () => {message.loading('Downloading PIA..', 0)};

interface Props{
    email: string
}

interface State{
    allPia: piaInfo[]
    tableData: tableData[]
    isSkeleton: boolean
    searchValue: string
    isSearch: boolean
    loadingDocument: boolean
}



class PTable extends React.Component<Props, State> {
        columns: any[]
        columnsForOfficer: any[]
        constructor(props: any){
        super(props);
            this.state = {
                allPia: [],
                tableData: [],
                isSkeleton: true,
                searchValue: "",
                isSearch: false,
                loadingDocument: false
            };
        this.emailNewPia = this.emailNewPia.bind(this);
        this.emailCommentPia = this.emailCommentPia.bind(this);
        this.emailEditPia = this.emailEditPia.bind(this);
        this.emailApprovePia = this.emailApprovePia.bind(this);
        this.emailRejectPia = this.emailRejectPia.bind(this);
        this.emailDeletePia = this.emailDeletePia.bind(this);
        this.columnsForOfficer = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: (name, key) => {
                    return (
                        <Link style={{color: "black", fontWeight: "500"}}  to={"/editPia:" + encrypted(this.state.allPia[parseInt(key.key)]._id)}>
                        { name }
                        </Link>
                    )
                },
                sorter: (a, b) => {
                    if (a.name > b.name) {
                        return 1;
                    } else return -1;
                },
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: status => {
                    console.log(status);
                    let color = 'geekblue';
                    switch (status) {
                        case 'APPROVED':
                            color = 'green';
                            break;
                        case 'REJECTED':
                            color = 'volcano';
                            break;
                        default:
                            color = 'geekblue';
                    }
                    return (
                        <Tag color={color} key={status}>
                            {status}
                        </Tag>
                    );
                },
                filters: [
                    {
                        text: 'APPROVED',
                        value: 'APPROVED'
                    },
                    {
                        text: 'REJECTED',
                        value: 'REJECTED'
                    },
                    {
                        text: 'PENDING',
                        value: 'PENDING'
                    }
                ],
                onFilter: (value, record) => record.status.indexOf(value) === 0,
            },
            {
                title: 'Date Submitted',
                dataIndex: 'submission_date',
                key: 'submission_date',
                sorter: (a, b) => Date.parse(a.submission_date) - Date.parse(b.submission_date),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'Action',
                key: 'action',
                width: '100px',
                render: (status, key) => {
                    return (
                        <div style={{display: "flex", flexDirection: "row", height: "100%", width: "100%", justifyContent:"left"}}>
                            <Tooltip placement="bottom" title={"Copy"} style={{flex: "1"}}>
                                <Link to={"/addNew:" + encrypted(this.state.allPia[parseInt(key.key)]._id)}>
                                    <Button style={{paddingLeft: "5px", paddingRight: "5px"}} type={"link"} ><CopyOutlined /></Button>
                                </Link>

                            </Tooltip>
                            {localStorage.getItem("isOfficer") === "true" ?
                                <Tooltip placement="bottom" title={"Delete"}>
                                    <Popconfirm
                                        title="Are you sure to delete this PIA?"
                                        onConfirm={() => { this.deletePia(key)}}
                                        onCancel={() => {}}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button style={{paddingLeft: "5px", paddingRight: "5px"}} type={"link"} onClick={() => {

                                        }}><DeleteOutlined /></Button>
                                    </Popconfirm>
                                </Tooltip>
                                :
                                null
                            }
                            {status.status === 'APPROVED' ?
                                <Tooltip placement="bottom" title={"Print"} style={{flex: "1"}}>
                                    <Button type={"link"} style={{paddingLeft: "5px", paddingRight: "5px"}} onClick={() => {this.onPrint(key)}}><PrinterOutlined /></Button>
                                </Tooltip>
                                :
                                null
                            }
                        </div>


                    );

                },
            },
        ];
    }


    async onPrint(key: tableData){
        if(!this.state.loadingDocument){
            try {
                this.setState({loadingDocument: true})
                LoadingButton();
                const response = await fetch(`/printPIA`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', "x-access-token": localStorage.getItem("token")},
                    body: JSON.stringify({Pia: this.state.allPia[parseInt(key.key)]}),
                })
            .then(function(resp){
                return resp.blob();
            }).then(function(blob){
                    var url = window.URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = "PIA.pdf";
                    document.body.appendChild(a);
                    a.click();    
                    a.remove();
                    message.destroy();
                    message.success('PIA downloaded', 2);
                    this.setState({loadingDocument: false})
            })
            } catch(err) {
                console.log(err);
                this.setState({loadingDocument: false})
            }
        }
    }

    async emailNewPia() {
        try {
            console.log(this.props.email);
            await fetch(`v1/email/emailNewPia/${this.props.email}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json())
                .then(data => console.log(data));
        } catch(err) {
            console.log(err);
        }
    } 
    
    async emailCommentPia() {
        try {
            console.log(this.props.email);
            await fetch(`v1/email/emailCommentPia/${this.props.email}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json())
                .then(data => console.log(data));
        } catch(err) {
            console.log(err);
        }
    }  
    
    async emailEditPia() {
        try {
            console.log(this.props.email);
            await fetch(`v1/email/emailEditPia/${this.props.email}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json())
                .then(data => console.log(data));
        } catch(err) {
            console.log(err);
        }
    }    

    async emailApprovePia() {
        try {
            console.log(this.props.email);
            await fetch(`v1/email/emailApprovePia`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json())
                .then(data => console.log(data));
        } catch(err) {
            console.log(err);
        }
    }    

    async emailRejectPia() {
        try {
            console.log(this.props.email);
            await fetch(`v1/email/emailRejectPia`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
            }).then(response => response.json()).then(
                data =>
                    console.log(data));
        } catch(err) {
            console.log(err);
        }
    }    

    async emailDeletePia() {
        try {
            console.log(this.props.email);
            await fetch(`v1/email/emailDeletePia`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json())
                .then(data => console.log(data));
        } catch(err) {
            console.log(err);
        }
    }    
    
    componentDidMount() {
        this.getAllPia()
    }

    async getAllPia() {
        try {
            apiCall(`/getAllPia`, 'POST', {})
                .then((data) => {
                    if (!data.isSuccess){
                        console.log(data.error)
                    }
                    else{
                        this.setState({allPia: data.allPia})
                        let newArr: tableData[] = []
                        this.state.allPia.forEach((el: piaInfo, index) => {
                            newArr.push({key: index.toString(), name: el.pia.projectName, status: el.status, submission_date: el.createdAt.substr(0, 10)})

                        })
                        setTimeout(() => {
                            this.setState({tableData: newArr, isSkeleton: false})
                        }, 500);

                    }

                    });
        } catch(err) {
            console.log(err);
        }
    }

    async deletePia(key: any) {
            let arrIndex = parseInt(key.key)
        try {
            apiCall(`/deletePia`, 'POST', {id: this.state.allPia[arrIndex]._id})
                .then((data) => {
                    if (!data.isSuccess){
                        console.log(data.message)
                    }
                    else{
                        message.success(data.message)
                        this.getAllPia()
                    }

                });
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        return (
            <div className='page-body'>
                <Skeleton loading={this.state.isSkeleton}>
                    <Row>
                        <Col span={12}>
                            {localStorage.getItem("isOfficer") === "true" ?
                                <h1>All PIAs</h1>
                                :
                                <h1>Your PIAs</h1>
                            }
                        </Col>
                        <Col span={12} style={{justifyContent: "end", display: "flex", marginTop: "9px"}}>
                            <Button onClick={() => {this.setState({isSearch: !this.state.isSearch})}} icon={<SearchOutlined />} type={"link"}/>
                            {this.state.isSearch ?
                                <Input autoFocus allowClear style={{height: "32px", width: "150px"}} onChange={(e) => {this.setState({searchValue: e.target.value.toLowerCase()})}} placeholder="search by name" bordered={false}/>
                                       :
                                null
                            }
                        </Col>
                    </Row>

                    <Table
                        className='table'
                        bordered
                        pagination={{ defaultPageSize: 7, showSizeChanger: true, pageSizeOptions: ['7', '20', '30', '50', '100'], className: 'table'}}
                        dataSource={this.state.tableData.filter(data => data.name.toLowerCase().includes(this.state.searchValue))}
                        columns={this.columnsForOfficer}
                    />

                        <Row style={{paddingTop: this.state.tableData.length === 0 || this.state.tableData.filter(data => data.name.toLowerCase().includes(this.state.searchValue)).length === 0 ? "40px": ""}}  >
                            <Link to="/addNew">
                                <Button style={{backgroundColor: "#ffc82c", color: "#173a64", border: "none"}} type="primary">New PIA</Button>
                            </Link>
                        </Row>

                </Skeleton>

            </div>
        );
    }
}

export default PTable;