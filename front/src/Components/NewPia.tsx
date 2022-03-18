import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import classicEditor from '@ckeditor/ckeditor5-build-classic'
import {
    Form, Button, Radio,  Input, Select, Row,
} from 'antd';
import '../CSS/App.css';
import * as React from "react";
import {Link} from "react-router-dom";


interface State{
  projectName: string;
  sponsoringBusinessUnit: string
  projectDescription: string
  isCollected: boolean
  purpose: string
  individualsInfo: string
  isDisclosed: boolean
  data:string
}


export default class  NewPia extends React.Component<any, State>{
          constructor(props: any){
              super(props);
              this.state = {
                  projectName: "",
                  sponsoringBusinessUnit: "",
                  projectDescription: "",
                  isCollected: null,
                  purpose: "",
                  individualsInfo: "",
                  isDisclosed: null,
                  data: "",

              };
              this.onSubmit=this.onSubmit.bind(this)
              
          }

        // onChangeProjName = (event) => {
        //       this.setState({projectName: event.target.value})
        //     alert("Hey")
        // }
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
         onChangeIndividualsInfo (individualsInfo, editor) {
            this.setState({ individualsInfo });
           
          }
         onChangeIsDisclosed = (event) => {
        this.setState({isDisclosed: event.target.value==='1'})
    }
    handleDescriptionDataChange
    (data, editor) {
        this.setState({ data });
       
      }
  

    onSubmit=(e)=> {

              e.preventDefault();
             console.log(this.state.purpose)
    }
 
          render(){
              return (
                  <div className="newpiaContainer">
                      <Form onSubmitCapture={this.onSubmit}
                      >
                      <label htmlFor="Project Name">Project Name</label>
                      <br />
                          <Form.Item>
                              <Input value={this.state.projectName} onChange={e=>this.setState({projectName:e.target.value})} type="text" name="ProjName" />
                          </Form.Item>

                          <label htmlFor="sponsors">Sponsoring Business Unit</label> <br/>
                          <Form.Item>
                              <Select id="sponsors" value={this.state.sponsoringBusinessUnit} onChange={this.onChangeSponsoringBusinessUnit} >
                                  <Select.Option value="Demo1">Demo1</Select.Option>
                                  <Select.Option value="Demo2">Demo2</Select.Option>
                                  <Select.Option value="Demo3">Demo3</Select.Option>
                                  <Select.Option value="Demo4">Demo4</Select.Option>
                              </Select>
                          </Form.Item>

                          
                          <label htmlFor="Description">Project description</label>
                              <br/>
                              {/* <TextArea name="Description" onChange={this.onChangeProjectDescription} /> */}
                              <CKEditor
                          editor={classicEditor}
                          value={this.state.data}
          init={{
            height: 200,
            menubar: false
          }}
          onChange={ ( event, editor ) => {
            const data = editor.getData();
            console.log( { event, editor, data } );
        } 
          }
                        
                          />
                          <br />
                         
                         <label htmlFor="Necessity">Is it necessary for the purpose of the project that personal information be collected, used or disclosed?</label>
                         <br />
                          <Form.Item>
                              

                              <Radio.Group onChange={this.onChangeIsCollected}>
                                  <Radio value={'Yes'}>Yes</Radio>
                                  <Radio value={'NO'}>No</Radio>
                              </Radio.Group>
                              {this.state.isCollected ?
                              <Input/>
                              :
                              null
                              }

                          </Form.Item>
                            <br />
                        <label htmlFor="Purpouse">Which “purpose” in S2.3 of the FortisBC Privacy Policy applies to this project? </label>
                          <Form.Item>
                              <Select id="purpose" value={this.state.purpose} onChange={this.onChangePurpose} >
                                  <Select.Option value="Demo1">Demo1</Select.Option>
                                  <Select.Option value="Demo2">Demo2</Select.Option>
                              </Select>
                          </Form.Item>
                       <label htmlFor="accountableIndividuals">List the individuals accountable for the personal information</label>
                       <br />
                                    
                              {/* <TextArea id="accountableIndividuals" name="accountableIndividuals" onChange={this.onChangeIndividualsInfo} /> */}
                              <CKEditor
                          editor={classicEditor}
                          value={this.state.individualsInfo}
                          init={{
                            height: 200,
                            menubar: false
                          }}
                          onEditorChange={this.onChangeIndividualsInfo
                          }/>
                     <br />
                     
                     <label htmlFor="Disclosure" >is any information being disclosed or stored outside of Canada as part of this project? </label>
                          <Form.Item>
                              <br/>
                              <Radio.Group onChange={this.onChangeIsDisclosed }>
                                  <Radio value={'1'}>Yes</Radio>
                                  <Radio value={'2'}>No</Radio>
                              </Radio.Group>


                          </Form.Item>
                        
                      
                        <Row>
                            <div className="btn">
                                <Button type="default" onClick={e=>this.onSubmit(e)}
                                        style={{background: "#FFC82C", color: "black"}}>Submit</Button>
                            </div>
                            <div className="btn" style={{paddingLeft: "15px"}}>
                                <Link to="/">
                                    <Button type="default" onClick={() => {}}
                                            style={{background: "#ffffff", color: "black"}}>Back</Button>
                                </Link>
                            </div>
                        </Row>
                      </Form>
                  </div>
              );
          }
      }