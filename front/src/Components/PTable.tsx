import * as React from "react";
import '../CSS/App.css';
import '../CSS/PTable.css';
import { Row, Col, Table, Button } from 'antd';
// @ts-ignore
import { dataSource, columns } from '../consts/TableSetup.tsx';
import {Link} from "react-router-dom";

class PTable extends React.Component {
    render() {
        return (
            <div className='page-body'>
                <h1>View PIAs</h1>
                <Table dataSource={dataSource} columns={columns} />
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