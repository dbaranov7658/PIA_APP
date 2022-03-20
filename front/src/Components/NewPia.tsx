import { CKEditor } from '@ckeditor/ckeditor5-react';
import classicEditor from '@ckeditor/ckeditor5-build-classic'
import {Form, Button, Radio, Input, Select, Row, FormInstance,} from 'antd';
import '../CSS/App.css';
import * as React from "react";
import {Link} from "react-router-dom";
import TextArea from "antd/es/input/TextArea";


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
    data:string
}


export default class  NewPia extends React.Component<any, State>{
    formRef = React.createRef<FormInstance>();
    constructor(props: any){
        super(props);
        this.state = {
            disclosedInfo: "",
            personalInfo: "",
            projectName: "",
            sponsoringBusinessUnit: "",
            projectDescription: "",
            isCollected: null,
            purpose: "",
            individualsInfo: "",
            isDisclosed: null,
            data: "",

        }

    }


    handleDescriptionDataChange
    (data, editor) {
        this.setState({ data });

    }


    onSubmit = (e) => {
        e.preventDefault();
        if (e){

        }
        console.log(this.state.purpose)
        console.log(this.state.projectName)
        console.log(this.state.projectDescription)
        console.log(this.state.sponsoringBusinessUnit)
        console.log(this.state.individualsInfo)
        console.log(this.state.isDisclosed)
        console.log(this.state.isCollected)
    }

    render(){
        return (
            <div className="newpiaContainer">

                <Form onSubmitCapture={this.onSubmit}
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

                    <Form.Item label="Project description"  rules={[{ required: true, message: 'Please enter the project description!' }]}  name="projectDescription" >

                    <CKEditor
                        config={{
                            toolbar: ['heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList']
                        }}
                        editor={classicEditor}
                        data={this.state.data}
                        value={this.state.data}
                        init={{
                            height: 200,
                            menubar: false
                        }}
                        onChange={ ( event, editor ) => {
                            this.setState({projectDescription: editor.getData()})
                        }
                        }

                    />

                    </Form.Item >

                    <Form.Item label="Is it necessary for the purpose of the project that personal information be collected, used or disclosed?" rules={[{required:true, message:"Please select an option!"}]}>

                        <Radio.Group onChange={(e) => {
                            this.setState({isCollected: e.target.value === "1"})
                        }} >
                            <Radio value={'1'}>Yes </Radio>

                            <Radio value={'2'}>No</Radio>
                        </Radio.Group>


                    </Form.Item>

                    {this.state.isCollected ?
                            <Form.Item label="What personal information will be collected, used or disclosed?"  rules={[{ required: true, message: 'Please enter the project description!' }]}  name="personalInformation" >

                                <CKEditor
                                    config={{
                                        toolbar: ['heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList']
                                    }}
                                    editor={classicEditor}
                                    data={this.state.data}
                                    value={this.state.data}
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

                    <Form.Item label="Which “purpose” in S2.3 of the FortisBC Privacy Policy applies to this project?"
                               name="purpose"
                               hasFeedback validateFirst={true}
                    >
                        <Select allowClear id="purpose" value={this.state.purpose} onChange={(e) => { this.setState({purpose: e})}} >
                            <Select.Option value="Demo1">Demo1</Select.Option>
                            <Select.Option value="Demo2">Demo2</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="List the individuals accountable for the personal information" name="individualsAccountable">

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

                    <Form.Item label="Is any information being disclosed or stored outside of Canada as part of this project?" name="isDisclosed">
                        <Radio.Group onChange={(e) => { this.setState({isDisclosed: e.target.value === '1'})} }>
                            <Radio value={'1'}>Yes</Radio>
                            <Radio value={'2'}>No</Radio>
                        </Radio.Group>


                    </Form.Item>

                    {this.state.isDisclosed ?
                        <Form.Item label="What information being disclosed or stored outside of Canada as part of this project??"  rules={[{ required: true, message: 'Please enter the project description!' }]}  name="disclosedInformation" >

                            <CKEditor
                                config={{
                                    toolbar: ['heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList']
                                }}
                                editor={classicEditor}
                                data={this.state.data}
                                value={this.state.data}
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
