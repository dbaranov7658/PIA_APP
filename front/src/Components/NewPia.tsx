import '../CSS/App.css';
import React from 'react';
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,

} from 'antd';
const { TextArea } = Input;



function NewPia() {
  return (
    <div>
      <Form>


        <Form.Item label="Project Name">
          <Input />
        </Form.Item>
        <Form.Item label="Sponsoring Group">
          <Select>
            <Select.Option value="demo">Demo1</Select.Option>
            <Select.Option value="demo">Demo2</Select.Option>
            <Select.Option value="demo">Demo3</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Project Desctiption">
          <TextArea />
          <br />
          <br />
          <Form.Item label="Is it necessary for the purpose of the project that personal information be collected, used or disclosed?">

            <Radio value={1}>Yes</Radio>
            <Radio value={2}>No</Radio>
          </Form.Item>
          <Form.Item label="Individuals accountable for the personal information ">
            <Select>
              <Select.Option value="demo">Demo1</Select.Option>
              <Select.Option value="demo">Demo2</Select.Option>
              <Select.Option value="demo">Add new</Select.Option>
            </Select>
          </Form.Item>
        </Form.Item>
        <Form.Item label="Which “purpose” in S2.3 of the FortisBC Privacy Policy applies to this project? ">
          <Cascader
            options={[
              {
                value: 'Demo1',
                label: 'Demo1',

              },
              {
                value: 'Demo2',
                label: 'Demo2',
              },
              {
                value: 'Demo3',
                label: 'Demo3',
              },
            ]}

          />
        </Form.Item>
        <Form.Item label="Is any information being disclosed or stored outside of Canada as part of this project? ">

          <Radio value={1}>Yes</Radio>
          <Radio value={2}>No</Radio>
        </Form.Item>
        <Button>Submit PIA
        </Button>
      </Form>
   
    </div>
  )
}

export default NewPia