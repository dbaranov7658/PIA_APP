import * as React from "react";
import '../CSS/App.css';
import '../CSS/PTable.css';
import { Row, Table, Button } from 'antd';
// @ts-ignore
import {dataSource, columns, columnsForOfficer} from '../consts/TableSetup.tsx';
import {Link} from "react-router-dom";



interface Props{
    isOfficer: boolean,
    email: string
}

interface State{
    isOfficer: boolean
}

class PTable extends React.Component<Props, State> {
    constructor(props: any){
        super(props);
        this.emailNewPia = this.emailNewPia.bind(this);
        this.emailCommentPia = this.emailCommentPia.bind(this);
        this.emailEditPia = this.emailEditPia.bind(this);
        this.emailApprovePia = this.emailApprovePia.bind(this);
        this.emailRejectPia = this.emailRejectPia.bind(this);
        this.state = {
            isOfficer: this.props.isOfficer
        };
    }

    async emailNewPia() {
        try {
            console.log(this.props.email);
            await fetch(`v1/email/emailNewPia/:${this.props.email}`, {
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
            await fetch(`v1/email/emailCommentPia/:${this.props.email}`, {
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
            await fetch(`v1/email/emailEditPia/:${this.props.email}`, {
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
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json())
                .then(data => console.log(data));
        } catch(err) {
            console.log(err);
        }
    }    
    
    componentDidMount() {
        this.setState({})
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isOfficer !== this.state.isOfficer){
            this.setState({isOfficer: this.props.isOfficer})
        }
    }

    render() {
        return (
            <div className='page-body'>
                {console.log(this.props.email)}
                {this.props.isOfficer ?
                    <h1>All PIAs</h1>
                    :
                    <h1>Your PIAs</h1>
                }
                <Table dataSource={dataSource} columns={this.state.isOfficer ? columnsForOfficer : columns} />
                <Row>
                    <Link to="/addNew">
                    <Button style={{backgroundColor: "#ffc82c", color: "#173a64", border: "none"}} type="primary">New PIA</Button>
                    </Link>
                </Row>
                <p style={{ paddingTop: "2rem" }}>Email test buttons: </p>
                <Row>
                    <Button type="primary" onClick={this.emailNewPia} style={{marginRight: "40px"}}>Submit new PIA</Button>
                    <Button type="primary" onClick={this.emailCommentPia} style={{ marginRight: "40px" }}>Comment on PIA</Button>
                    <Button type="primary" onClick={this.emailEditPia} style={{ marginRight: "40px" }}>Edit PIA</Button>
                    <Button type="primary" onClick={this.emailApprovePia} style={{ marginRight: "40px" }}>Approve PIA</Button>
                    <Button type="primary" onClick={this.emailRejectPia} style={{marginRight: "40px"}}>Reject PIA</Button>
                </Row>
            </div>
        );
    }
}
export default PTable;