import React, { useState } from "react";
import {
  Form,Button,Radio,Cascader, Input, Select,
} from 'antd';

const {TextArea}=Input

export default function NewPia() {
  const [user, setUser] = useState({ fullname: "", sponsors: "", Description:  "",Disclosure:"",Purpouse:"",Necessity:"",accountableIndividuals:"", });

  const handleChange = (event) => {
  console.log(event.value)
    setUser({ ...user, [event.target.name]: event.target.value });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  return (
  <div className="newpiaContainer">
    <Form onSubmitCapture={handleSubmit}
    >
 
      <Form.Item htmlFor="ProjName" label="Project Name"> 
  
      <Input type="text" name="ProjName" onChange={handleChange}  />
      </Form.Item>
      
      <label htmlFor="sponsors">Sponsoring Business Unit</label> <br />
      <Form.Item>
      <Select id="sponsors" onChange={handleChange} >
      <Select.Option value="default">default</Select.Option>
      <Select.Option value="saab">Saab</Select.Option>
      <Select.Option value="fiat">Fiat</Select.Option>
      <Select.Option value="audi">Audi</Select.Option>
      </Select>
      </Form.Item>
     
      <Form.Item  htmlFor="Description" label="Project description">
      <br />
      <TextArea  name="Description" onChange={handleChange} />
     </Form.Item>
     <Form.Item label="Is it necessary for the purpose of the project that personal information be collected, used or disclosed?"htmlFor="Necessity">
     <br />
     <br />
     
     <Radio.Group onChange={handleChange}>
      <Radio value={1}>Yes</Radio>
      <Radio value={2}>No</Radio>
    </Radio.Group>
   
    </Form.Item>

<Form.Item label="Which “purpose” in S2.3 of the FortisBC Privacy Policy applies to this project? " name="Purpouse" htmlFor="Purpouse"> 
          <br />
          <Cascader id="Purpouse" onChange={handleChange}
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
        <Form.Item label="List the individuals accountable for the personal information" htmlFor="accountableIndividuals">
        <TextArea id="accountableIndividuals" name="accountableIndividuals" onChange={handleChange} />
        
        </Form.Item>
        <Form.Item label="is any information being disclosed or stored outside of Canada as part of this project? "htmlFor="Disclosure"name="Disclosure" 
          rules={[{ required: true, message: "Please select an option!" }]}>
          <br />
      <Radio.Group onChange={handleChange}>
      <Radio value={1}>Yes</Radio>
      <Radio value={2}>No</Radio>
    </Radio.Group>
   
   
 
     </Form.Item>

<div className="btn"><Button type="default" style={{background:"#FFC82C",color:"black"}}>Submit</Button>
</div>

    </Form>
    </div>
  );
}