import * as React from "react";
import '../CSS/App.css';
import '../CSS/PTable.css';
import { Row, Table, Button } from 'antd';
// @ts-ignore
import {dataSource, columns, columnsForOfficer} from '../consts/TableSetup.tsx';
import {Link} from "react-router-dom";



interface Props{
    isOfficer: boolean
}

interface State{
    isOfficer: boolean
}

class PTable extends React.Component<Props, State> {
    constructor(props: any){
        super(props);
        this.state ={
            isOfficer: this.props.isOfficer
        };
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
            </div>
        );
    }
}
export default PTable;