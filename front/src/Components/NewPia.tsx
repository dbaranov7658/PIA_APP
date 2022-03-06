
import '../CSS/App.css';
import React from 'react';
import FormItem from 'antd/lib/form/FormItem';
import {
    Form,Input,Button,Radio,Select,Cascader,
  } from 'antd';
  const { TextArea } = Input;
export default class NewPia extends React.Component<any, any>  {
  constructor(props:any) {
    super(props);
    this.state = {
      ProjectName: '',
      sponsoringGroup:'',
      projDescription:'',
      
    };
    this.handleChange=this.handleChange.bind(this)
    this.handleSubmit=this.handleSubmit.bind(this)
    
  }
  handleChange=(event) =>{
    this.setState({
    [event.target.name] :event.target.value
    })}
  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }
  render() {
    return (
    <div className='newpiaContainer'>
      <Form onSubmitCapture={this.handleSubmit}>
      <FormItem>
        <label>ProjectName</label><br />
          <Input type="text" name="projectName" value={this.state.ProjectName} onChange={this.handleChange}></Input>
          <br />
          </FormItem>
          
          <FormItem>
          <label>sponsoringGroup</label><br />
          <Select value={this.state.sponsoringGroup} onChange={this.handleChange}>
          <Select.Option value="default">Default</Select.Option>
          <Select.Option value="addNew">Add new</Select.Option>
          </Select>
          </FormItem>
          
          <br />
          
          <FormItem>
          <label>Description</label><br />
          <TextArea name="projDescription" value={this.state.Description} onChange={this.handleChange}/>
          </FormItem>
          <br />
          
          
          <FormItem>
          <label>is it necessary for the purpouse of the project that personal information be collected, used or disclosed</label><br />
          {/* {
          this.state.checkbox ?
          
          :
          null
          } */}
          <Radio value={1}>Yes</Radio>
          <Radio value={2}>No</Radio>
          </FormItem>
          <br />
          
          <FormItem>
          <label>List the individuals accountable for the personal information</label><br />
          <Select value={this.state.value} >
          <Select.Option value="Demo">Demo</Select.Option>
          <Select.Option>AddNew</Select.Option>
          </Select>
          </FormItem>
          <br />
          <Form.Item label="Which “purpose” in S2.3 of the FortisBC Privacy Policy applies to this project? "> 
          <br />
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
          <br />
          <FormItem>
          <label>is any information being disclosed or stored outside of Canada as part of this project? </label><br />
          <Radio value={1} name="yes" id="y">Yes</Radio>
          <Radio value={2}name="yes" id="n">No</Radio>
          
          </FormItem>
    <br />
    <FormItem>
        <button type="submit" name="submit">Submit</button>
        </FormItem>
      </Form>
      </div>
    );
  }
}




