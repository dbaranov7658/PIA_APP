import React, { Component } from 'react';
import '../CSS/App.css';
import '../CSS/PTable.css';
import { Row, Col, Table, Button } from 'antd';
// @ts-ignore
import { dataSource, columns } from './TableSetup.tsx';

class PTable extends React.Component {
    render() {
        return (
            <div class='page-body'>
                <h1>View PIAs</h1>
                <Table dataSource={dataSource} columns={columns} />
                <Row>
                    <Button type="primary">New PIA</Button>
                </Row>
            </div>
        );
    }
}
export default PTable;