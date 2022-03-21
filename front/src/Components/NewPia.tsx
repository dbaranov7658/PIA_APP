import { CKEditor } from '@ckeditor/ckeditor5-react';
import classicEditor from '@ckeditor/ckeditor5-build-classic'
import {Form, Button, Radio, Input, Select, Row, FormInstance, message,} from 'antd';
import '../CSS/App.css';
import * as React from "react";
import {Link} from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
// @ts-ignore
import {PIA} from "../consts/interfaces.tsx";


interface State{
    personalInfo: string;
    projectName: string;
    sponsoringBusinessUnit: string
    projectDescription: string
    isCollected: boolean
    purpose: string
    individualsInfo: string
    isDisclosed: boolean
    disclosedInfo: string
}


export default class  NewPia extends React.Component<any, State>{
    formRef = React.createRef<FormInstance>();
    constructor(props: any){
        super(props);
        this.state = {
            disclosedInfo: undefined,
            personalInfo: undefined,
            projectName: "",
            sponsoringBusinessUnit: "",
            projectDescription: undefined,
            isCollected: null,
            purpose: "",
            individualsInfo: undefined,
            isDisclosed: null,

        }

    }


    onSubmit = (e) => {
        e.preventDefault();
        if (e){
            this.formRef.current.validateFields().then(async (er) => {
                           if (this.state.projectDescription !== "" && (!this.state.isCollected || (this.state.isCollected && this.state.personalInfo !== "")) && (!this.state.isDisclosed || (this.state.disclosedInfo !== "" && this.state.isDisclosed))) {
                        var newPia: PIA = {
                            projectName: this.state.projectName,
                            sponsoringBusinessUnit: this.state.sponsoringBusinessUnit,
                            projectDescription: this.state.projectDescription,
                            isCollected: this.state.isCollected,
                            personalInfo: this.state.personalInfo,
                            purpose: this.state.purpose,
                            individualsInfo: this.state.individualsInfo,
                            isDisclosed: this.state.isDisclosed,
                            disclosedInfo: this.state.disclosedInfo,
                        }
                        await fetch('/addNew', {
                                   method: 'POST',
                                   headers: {'Content-Type': 'application/json', "x-access-token": localStorage.getItem("token")},
                                   body: JSON.stringify({Pia: newPia})
                               }).then((response) => {
                                   response.json().then((response) => {
                                       if (!response.isSuccess){
                                           console.log(response.error)
                                           message.error(response.message)
                                       }
                                       else {
                                           console.log(response.message)
                                           message.success(response.message)
                                       }

                                   })
                               })
                    }
            }).catch((er) => {
                message.error("Please correct the mistake in form")
            })
        }
    }

    render(){
        return (
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100% - 100px)", width: "100%", marginTop: "100px", zIndex: 1}}>

                <Form style={{paddingTop: "25px", paddingBottom: "40px"}}
                    onSubmitCapture={(e) => {this.onSubmit(e)} }
                      layout="vertical"
                      scrollToFirstError
                      ref={this.formRef}
                >
                    <Form.Item label="Project Name" rules={[{required: true, message: 'Please enter your Project Name!' }]} name="projectName"   hasFeedback>
                        <Input value={this.state.projectName}
                               onChange={e=>this.setState({projectName :e.target.value})}
                               type="text" name="ProjName"
                               placeholder="Project Name"
                        />

                    </Form.Item>


                    <Form.Item label="Sponsoring Business Unit" rules={[{required: true, message: 'Please enter Sponsoring Business Unit!' }]} name="sponsors"  hasFeedback >
                        <Select allowClear={true} id="sponsors" value={this.state.sponsoringBusinessUnit}
                                onChange={(e) => {this.setState({sponsoringBusinessUnit: e})} }

                                placeholder="Select Sponsoring Business Unit">
                            <Select.Option value="Demo1">Demo1</Select.Option>
                            <Select.Option value="Demo2">Demo2</Select.Option>
                            <Select.Option value="Demo3">Demo3</Select.Option>
                            <Select.Option value="Demo4">Demo4</Select.Option>
                        </Select>
                    </Form.Item>



                        <Form.Item label="Project description" style={{marginBottom: this.state.projectDescription === "" ? "0px" : "24px"}}
                                   rules={[{ required: true, message: 'Please enter the project description' }]}  name="projectDescription" >

                            <CKEditor
                                data={this.state.projectDescription}
                                config={{
                                    toolbar: ['heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList']
                                }}
                                editor={classicEditor}
                                init={{
                                    height: 200,
                                    menubar: false
                                }}

                                value={this.state.projectDescription}
                                onChange={ ( event, editor ) => {
                                    this.setState({projectDescription: editor.getData()})
                                }
                                }

                            />

                        </Form.Item >

                    {this.state.projectDescription === "" ?
                    <div style={{color: "red", marginBottom: "24px"}}>Please enter the project description</div>
                        :
                        null
                    }


                    <Form.Item label="Is it necessary for the purpose of the project that personal information be collected, used or disclosed?" rules={[{required:true, message:"Please select an option"}]}
                               name="isCollected">

                        <Radio.Group onChange={(e) => {
                            this.setState({isCollected: e.target.value === "1"})
                        }} >
                            <Radio value={'1'}>Yes </Radio>

                            <Radio value={'2'}>No</Radio>
                        </Radio.Group>


                    </Form.Item>

                    {this.state.isCollected ?
                            <Form.Item label="What personal information will be collected, used or disclosed?"  style={{marginBottom: this.state.personalInfo === "" ? "0px" : "24px"}}
                                       rules={[{ required: true, message: 'Please enter the personal information' }]}  name="personalInformation" >

                                <CKEditor
                                    config={{
                                        toolbar: ['heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList']
                                    }}
                                    editor={classicEditor}
                                    init={{
                                        height: 200,
                                        menubar: false
                                    }}
                                    onChange={ ( event, editor ) => {
                                        this.setState({personalInfo: editor.getData()})
                                    }
                                    }

                                />
                            </Form.Item>
                           :
                            null


                    }

                    {this.state.personalInfo === "" && this.state.isCollected ?
                        <div style={{color: "red", marginBottom: "24px"}}>Please enter the personal information</div>
                        :
                        null
                    }



                    <Form.Item label="Which “purpose” in S2.3 of the FortisBC Privacy Policy applies to this project?"
                               name="purpose"
                               rules={[{ required: true, message: 'Please select an option' }]}
                               hasFeedback validateFirst={true}
                    >
                        <Select allowClear id="purpose" value={this.state.purpose} onChange={(e) => { this.setState({purpose: e})}} >
                            <Select.Option value="Demo1">Demo1</Select.Option>
                            <Select.Option value="Demo2">Demo2</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="List the individuals accountable for the personal information"
                               style={{marginBottom: this.state.individualsInfo === "" ? "0px" : "24px"}}
                               name="individualsAccountable" rules={[{ required: true, message: 'Please list individuals' }]}>

                    <CKEditor
                        config={{
                            toolbar: ['heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList']
                        }}
                        editor={classicEditor}
                        value={this.state.individualsInfo}
                        init={{
                            height: 200,
                            menubar: false
                        }}
                        onChange={(event, editor) => {
                            this.setState({individualsInfo: editor.getData()})
                        }}
                    />
                    </Form.Item>

                    {this.state.individualsInfo === "" ?
                        <div style={{color: "red", marginBottom: "24px"}}>Please list individuals</div>
                        :
                        null
                    }

                    <Form.Item label="Is any information being disclosed or stored outside of Canada as part of this project?" name="isDisclosed"
                               rules={[{ required: true, message: 'Please select an option' }]}>
                        <Radio.Group onChange={(e) => { this.setState({isDisclosed: e.target.value === '1'})} }>
                            <Radio value={'1'}>Yes</Radio>
                            <Radio value={'2'}>No</Radio>
                        </Radio.Group>


                    </Form.Item>

                    {this.state.isDisclosed ?
                        <Form.Item label="What information being disclosed or stored outside of Canada as part of this project??"
                                   style={{marginBottom: this.state.disclosedInfo === "" ? "0px" : "24px"}}
                                   rules={[{ required: true, message: 'Please enter the disclosed information' }]}  name="disclosedInformation" >

                            <CKEditor
                                config={{
                                    toolbar: ['heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList']
                                }}
                                editor={classicEditor}
                                value={this.state.disclosedInfo}
                                init={{
                                    height: 200,
                                    menubar: false
                                }}
                                onChange={(event, editor) => {
                                    this.setState({disclosedInfo: editor.getData()})
                                }}

                            />
                        </Form.Item>
                        :
                        null
                    }

                    {this.state.disclosedInfo === "" && this.state.isDisclosed ?
                        <div style={{color: "red", marginBottom: "24px"}}>Please enter the disclosed information</div>
                        :
                        null
                    }


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
