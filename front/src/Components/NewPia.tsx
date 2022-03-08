
import {
  Form,Button,Radio,Cascader, Input, Select,
} from 'antd';
import '../CSS/App.css';
import * as React from "react";
import {useState} from "react";
import { Checkbox} from 'antd';

const CheckboxGroup = Checkbox.Group;

      const {TextArea} = Input


interface State{
  projectName: string;
  sponsoringBusinessUnit: string
  projectDescription: string
  isCollected: boolean
  purpose: string
  individualsInfo: string
  isDisclosed: boolean
}

export default class NewPia extends React.Component<any, State>{
          constructor(props: any){
              super(props);
              this.state ={
                  projectName: "",
                  sponsoringBusinessUnit: "",
                  projectDescription: "",
                  isCollected: null,
                  purpose: "",
                  individualsInfo: "",
                  isDisclosed: null
              };
          }

        onChangeProjName = (event) => {
              this.setState({projectName: event.target.value})
        }
        onChangeSponsoringBusinessUnit = (event) => {
                this.setState({sponsoringBusinessUnit: event})
    }
         onChangeProjectDescription = (event) => {
                this.setState({projectDescription: event.target.value})
    }
         onChangeIsCollected = (event) => {
                this.setState({isCollected: event.target.value === '1'})
    }
         onChangePurpose = (event) => {
                 this.setState({purpose: event})
    }
         onChangeIndividualsInfo = (event) => {
                 this.setState({individualsInfo: event.target.value})
    }
         onChangeIsDisclosed = (event) => {
        this.setState({isDisclosed: event.target.value})
    }



          render(){
              return (
                  <div className="newpiaContainer">
                      <Form
                      >
                          <Form.Item htmlFor="ProjName" label="Project Name">

                              <Input onChange={this.onChangeProjName} type="text" name="ProjName" />
                          </Form.Item>

                          <label htmlFor="sponsors">Sponsoring Business Unit</label> <br/>
                          <Form.Item>
                              <Select id="sponsors" onChange={this.onChangeSponsoringBusinessUnit} >
                                  <Select.Option value="default">default</Select.Option>
                                  <Select.Option value="saab">Saab</Select.Option>
                                  <Select.Option value="fiat">Fiat</Select.Option>
                                  <Select.Option value="audi">Audi</Select.Option>
                              </Select>
                          </Form.Item>

                          <Form.Item htmlFor="Description" label="Project description">
                              <br/>
                              <TextArea name="Description" onChange={this.onChangeProjectDescription} />
                          </Form.Item>
                          <Form.Item
                              label="Is it necessary for the purpose of the project that personal information be collected, used or disclosed?"
                              htmlFor="Necessity">
                              <br/>
                              <br/>

                              <Radio.Group onChange={this.onChangeIsCollected}>
                                  <Radio value={'1'}>Yes</Radio>
                                  <Radio value={'2'}>No</Radio>
                              </Radio.Group>

                          </Form.Item>

                          <Form.Item
                              label="Which “purpose” in S2.3 of the FortisBC Privacy Policy applies to this project? "
                              name="Purpouse" htmlFor="Purpouse">
                              <br/>
                              <Cascader id="Purpouse" onChange={this.onChangePurpose}
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
                          <Form.Item label="List the individuals accountable for the personal information"
                                     htmlFor="accountableIndividuals">
                              <TextArea id="accountableIndividuals" name="accountableIndividuals" onChange={this.onChangeIndividualsInfo} />

                          </Form.Item>
                          <Form.Item
                              label="is any information being disclosed or stored outside of Canada as part of this project? "
                              htmlFor="Disclosure" name="Disclosure"
                              rules={[{required: true, message: "Please select an option!"}]}>
                              <br/>
                              <Radio.Group onChange={this.onChangeIsDisclosed }>
                                  <Radio value={1}>Yes</Radio>
                                  <Radio value={2}>No</Radio>
                              </Radio.Group>


                          </Form.Item>

                          <div className="btn">
                              <Button type="default" onClick={() => {
                                  alert(this.state.isCollected)
                              }}
                                      style={{background: "#FFC82C", color: "black"}}>Submit</Button>
                          </div>

                      </Form>
                  </div>
              );
          }
      }