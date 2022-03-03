import React, { Component } from 'react';
import '../CSS/App.css';
import { Row, Col, Table } from 'antd';
// @ts-ignore
import { dataSource, columns } from './TableSetup.tsx';

class PTable extends React.Component {
    render() {
        return (
            <Col>
                <h1>View PIAs</h1>
                <Table dataSource={dataSource} columns={columns} />
            </Col>
        );
    }
}
export default PTable;