import * as React from "react";
import '../CSS/App.css';
import '../CSS/PTable.css';
import { Row, Table, Button } from 'antd';
// @ts-ignore
import {dataSource, columns, columnsForOfficer} from '../consts/TableSetup.tsx';
import {Link} from "react-router-dom";



interface State{
    isOfficer: boolean
}

class PTable extends React.Component<any, State> {
    constructor(props: any){
        super(props);
        this.state ={
            isOfficer: undefined
        };
    }


    componentDidMount() {
        this.setState({isOfficer: localStorage.getItem('isOfficer') === "true"})
    }



    render() {
        return (
            <div className='page-body'>
                {this.state.isOfficer ?
                    <h1>All PIAs</h1>
                    :
                    <h1>Your PIAs</h1>
                }
                <Table dataSource={dataSource} columns={this.state.isOfficer ? columnsForOfficer : columns} />
                <Row>
                    <Link to="/addNew">
                    <Button type="primary">New PIA</Button>
                    </Link>
                </Row>
            </div>
        );
    }
}
export default PTable;