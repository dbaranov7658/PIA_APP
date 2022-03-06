
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

    
  }

  handleprojectNamechange=(event: { target: { value: any; }; }) =>{
    this.setState({
    projectName:event.target.value
    })
    
  }
  handleSponsoringGroupChange=(event: { target: { value: any; }; }) => {
    this.setState({
    sponsoringGroup:event.target.value
    })
    
  }
  handleDescriptionChanges=(event: { target: { value: any; }; }) =>{
  this.setState({
    handleDescriptionChange:event.target.value
  })}
 

  handleSubmit(event: { preventDefault: () => void; }) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
    <div className='newpiaContainer'>
      <Form >
      <FormItem>
        <label>ProjectName</label><br />
          <Input type="text" name="projName" value={this.state.ProjectName} onChange={this.handleprojectNamechange}></Input>
          <br />
          </FormItem>
          
          <FormItem>
          <label>sponsoringGroup</label><br />
          <Select value={this.state.sponsoringGroup} onChange={this.handleSponsoringGroupChange}>
          <Select.Option value="default">Default</Select.Option>
          <Select.Option value="addNew">Add new</Select.Option>
          </Select>
          </FormItem>
          
          <br />
          
          <FormItem>
          <label>Description</label><br />
          <TextArea name="projDescription" value={this.state.Description} onChange={this.handleDescriptionChanges}/>
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
        <Button type="primary" name="submit">Submit</Button>
        </FormItem>
      </Form>
      </div>
    );
  }
}




