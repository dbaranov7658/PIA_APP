import { CKEditor } from '@ckeditor/ckeditor5-react';
import classicEditor from '@ckeditor/ckeditor5-build-classic'
import {Form, Button, Radio, Input, Select, Row, FormInstance, message, Col, Skeleton,} from 'antd';
import '../CSS/App.css';
import * as React from "react";
import {Link} from "react-router-dom";
import {comment} from "../interfaces";
import {pia} from "../interfaces";
// @ts-ignore
import CommentInterface from "../Components/CommentInterface.tsx"
import Draggable from 'react-draggable';
// @ts-ignore
import {decrypted} from "./Main.tsx";
// @ts-ignore
import {apiCall} from "../API/api.tsx";

interface Props {
    email: string
}

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
    comments: comment[]
    newComment: boolean
    isSkeleton: boolean
    isEdit: boolean
    piaId: string
    isReadOnly: boolean
}


export default class NewPia extends React.Component<Props, State>{
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
            comments: [],
            newComment: false,
            isSkeleton: true,
            isEdit: false,
            piaId: "",
            isReadOnly: false
        }

    }

    async componentDidMount() {
        if(window.location.pathname.includes("addNew:")){
            await this.getPiaById(true)
        }
        else if (window.location.pathname.includes("editPia:")){
            await this.getPiaById(false)
        }
        else {
            this.setState({isSkeleton: false})
        }
    }

    async getPiaById(isCopy: boolean){
        let id = window.location.pathname.substring(isCopy ? 8 : 9, window.location.pathname.length)
        try {
            apiCall(`/getPiaById`, 'POST', {id: decrypted(id)})
                .then((data) => {
                    if (!data.isSuccess){
                        console.log(data.message)
                        window.location.pathname = "/pageNotFound"
                    }
                    else{
                        this.setState({
                            isSkeleton: false,
                            disclosedInfo: data.Pia.pia.disclosedInfo === undefined ? "" : data.Pia.pia.disclosedInfo,
                            personalInfo: data.Pia.pia.personalInfo === undefined ? "" : data.Pia.pia.personalInfo,
                            projectName: isCopy ? data.Pia.pia.projectName + "(copy)" : data.Pia.pia.projectName,
                            sponsoringBusinessUnit: data.Pia.pia.sponsoringBusinessUnit,
                            projectDescription: data.Pia.pia.projectDescription,
                            isCollected: data.Pia.pia.isCollected,
                            purpose: data.Pia.pia.purpose,
                            individualsInfo: data.Pia.pia.individualsInfo,
                            isDisclosed: data.Pia.pia.isDisclosed,
                            comments: isCopy ? [] : data.Pia.pia.comments,
                            isEdit: !isCopy,
                            piaId: isCopy ? "" : decrypted(id),
                            isReadOnly: (data.Pia.status === "APPROVED" || data.Pia.status === "REJECTED") && !isCopy
                        })
                        this.formRef.current.setFieldsValue({
                            "projectDescription": data.Pia.pia.projectDescription,
                            "disclosedInformation": data.Pia.pia.disclosedInfo,
                            "personalInformation": data.Pia.pia.personalInfo,
                            "individualsAccountable": data.Pia.pia.individualsInfo
                        })
                    }

                });
        } catch(err) {
            console.log(err);
            window.location.pathname = "/pageNotFound"
        }
    }


    onSubmit = (e, newStatus?: string) => {
        e.preventDefault();
        if (e){
            this.formRef.current.validateFields().then(async (er) => {
                var newPia: pia = {
                    projectName: this.state.projectName,
                    sponsoringBusinessUnit: this.state.sponsoringBusinessUnit,
                    projectDescription: this.state.projectDescription,
                    isCollected: this.state.isCollected,
                    personalInfo: this.state.personalInfo,
                    purpose: this.state.purpose,
                    individualsInfo: this.state.individualsInfo,
                    isDisclosed: this.state.isDisclosed,
                    disclosedInfo: this.state.disclosedInfo,
                    comments: this.state.comments
                }
                if (this.state.isEdit){
                    var data = {
                        Pia: newPia,
                        id: this.state.piaId,
                        status: newStatus,
                        newComment: this.state.newComment,
                    }
                    apiCall('/editPia', 'POST', {data: data}).then((response) => {
                        if (!response.isSuccess){
                            console.log(response.error)
                            message.error(response.message)
                        }
                        else {
                            console.log(response.message)
                            message.success(response.message)
                            window.location.href = window.location.origin

                        }
                    })
                }
                else{

                    apiCall('/addNew', 'POST', {Pia: newPia}).then((response) => {
                        if (!response.isSuccess){
                            console.log(response.error)
                            message.error(response.message)
                        }
                        else {
                            console.log(response.message)
                            message.success(response.message)
                            window.location.href = window.location.origin

                        }
                    })

                }

            }).catch((er) => {
                console.log(er)
                message.error("Please correct the mistake in form")
            })
        }
    }

    onComment = (newComment: comment) => {
        let newArr = this.state.comments
        newArr.push(newComment)
        this.setState({ comments: newArr })
        this.setState({newComment: true})
    }


    newPia = () => {
        return (
            <Form className={"formPia"} style={{paddingTop: "25px", paddingBottom: "40px", width: "700px"}}
                  onSubmitCapture={(e) => {this.onSubmit(e)} }
                  layout="vertical"
                  scrollToFirstError
                  ref={this.formRef}
            >
                <Form.Item label="Project Name" rules={[{required: true, message: 'Please enter your Project Name!' }]} name="projectName" initialValue={this.state.projectName}   hasFeedback>
                    <Input value={this.state.projectName}
                           onChange={e=>this.setState({projectName :e.target.value})}
                           type="text" name="ProjName"
                           placeholder="Project Name"
                           disabled={this.state.isReadOnly}
                    />

                </Form.Item>


                <Form.Item initialValue={this.state.sponsoringBusinessUnit} label="Sponsoring Business Unit" rules={[{required: true, message: 'Please enter Sponsoring Business Unit!' }]} name="sponsors"  hasFeedback >
                    <Select disabled={this.state.isReadOnly} allowClear={true} id="sponsors" value={this.state.sponsoringBusinessUnit}
                            onChange={(e) => {this.setState({sponsoringBusinessUnit: e})} }
                            placeholder="Select Sponsoring Business Unit">
                        <Select.Option value="Business Innovation">Business Innovation</Select.Option>
                        <Select.Option value="Business Performance">Business Performance</Select.Option>
                        <Select.Option value="Communications">Communications</Select.Option>
                        <Select.Option value="Corporate Security & Business Continuity">Corporate Security & Business Continuity</Select.Option>
                        <Select.Option value="Customer Energy & Forecasting">Customer Energy & Forecasting</Select.Option>
                        <Select.Option value="Customer Service">Customer Service</Select.Option>
                        <Select.Option value="Energy Management">Energy Management</Select.Option>
                        <Select.Option value= "Energy Solutions"> Energy Solutions</Select.Option>
                        <Select.Option value="Energy Supply">Energy Supply</Select.Option>
                        <Select.Option value="Engineering">Engineering</Select.Option>
                        <Select.Option value="Environment, Health & Safety">Environment, Health & Safety</Select.Option>
                        <Select.Option value="External Relations">External Relations</Select.Option>
                        <Select.Option value="Facilities">Facilities</Select.Option>
                        <Select.Option value="Finance">Finance</Select.Option>
                        <Select.Option value="Fleet Services">Fleet Services</Select.Option>
                        <Select.Option value="Generation">Generation</Select.Option>
                        <Select.Option value="Human Resources">Human Resources</Select.Option>
                        <Select.Option value="Information Systems">Information Systems</Select.Option>
                        <Select.Option value="Integrity Management">Integrity Management</Select.Option>
                        <Select.Option value="Internal Audit">Internal Audit</Select.Option>
                        <Select.Option value="Legal">Legal</Select.Option>
                        <Select.Option value="Major Projects">Major Projects</Select.Option>
                        <Select.Option value="Market Development">Market Development</Select.Option>
                        <Select.Option value= "Measurement"> Measurement</Select.Option>
                        <Select.Option value="Plant Operations">Plant Operations</Select.Option>
                        <Select.Option value="Procurement">Procurement</Select.Option>
                        <Select.Option value="Regulatory Affairs">Regulatory Affairs</Select.Option>
                        <Select.Option value="Resource Planning">Resource Planning</Select.Option>
                        <Select.Option value="Safety & Training">Safety & Training</Select.Option>
                        </Select>
                </Form.Item>



                <Form.Item  label="Project description" name="projectDescription"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter the project description',
                                },
                                {
                                    validator(_, value) {
                                        if (value !== "") {
                                            return Promise.resolve();
                                        }
                                        else{
                                            return Promise.reject()
                                        }
                                    }
                                },
                            ]}
                >

                    <CKEditor
                        disabled={this.state.isReadOnly}
                        value={this.state.projectDescription}
                        data={this.state.projectDescription}
                        config={{
                            toolbar: ['heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList']
                        }}
                        editor={classicEditor}
                        init={{
                            height: 200,
                            menubar: false
                        }}
                        onChange={ ( event, editor ) => {
                            this.setState({projectDescription: editor.getData()})
                            this.formRef.current.setFieldsValue({
                                "projectDescription": editor.getData()
                            })
                        }
                        }
                    />

                </Form.Item >

                <Form.Item initialValue={window.location.pathname.includes(":") ?  this.state.isCollected ? '1' : '2' : undefined} label="Is it necessary for the purpose of the project that personal information be collected, used or disclosed?" rules={[{required:true, message:"Please select an option"}]}
                           name="isCollected">

                    <Radio.Group disabled={this.state.isReadOnly} style={{fontWeight: "400"}} onChange={(e) => {
                        this.setState({isCollected: e.target.value === "1"})
                    }}>
                        <Radio style={{fontSize: "15px"}} value={'1'}> <div>Yes </div>  </Radio>
                        <Radio style={{fontSize: "15px"}} value={'2'}>No</Radio>
                    </Radio.Group>


                </Form.Item>

                {this.state.isCollected ?
                    <Form.Item label="What personal information will be collected, used or disclosed?"
                               name="personalInformation"
                               rules={[
                                   {
                                       required: true,
                                       message: 'Please enter the personal information',
                                   },
                                   {
                                       validator(_, value) {
                                           if (value !== "") {
                                               return Promise.resolve();
                                           }
                                           else{
                                               return Promise.reject()
                                           }
                                       }
                                   },
                               ]}
                    >

                        <CKEditor
                            disabled={this.state.isReadOnly}
                            data={this.state.personalInfo}
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
                                this.formRef.current.setFieldsValue({
                                    "personalInformation": editor.getData()
                                })
                            }
                            }

                        />
                    </Form.Item>
                    :
                    null
                }

                <Form.Item  initialValue={this.state.purpose} label="Which “purpose” in S2.3 of the FortisBC Privacy Policy applies to this project?"
                           name="purpose"
                           rules={[{ required: true, message: 'Please select an option' }]}
                           hasFeedback validateFirst={true}
                >
                    <Select disabled={this.state.isReadOnly} allowClear id="purpose" value={this.state.purpose} onChange={(e) => { this.setState({purpose: e})}} >
                        <Select.Option value="To create and maintain an effective business relationship">To create and maintain an effective business relationship</Select.Option>
                        <Select.Option value="For quality assurance purposes such as the recording of telephone calls to our call centers">For quality assurance purposes such as the recording of telephone calls to our call centers</Select.Option>
                        <Select.Option value="To facilitate account, billing, credit, collections and customer services, this may include the collection of contact information, emergency contact information, consent to complete a credit check for new customers">To facilitate account, billing, credit, collections and customer services, this may include the collection of contact information, emergency contact information, consent to complete a credit check for new customers</Select.Option>
                        <Select.Option value="To provide ongoing electricity, natural gas, propane and various other services to its customers">To provide ongoing electricity, natural gas, propane and various other services to its customers</Select.Option>
                        <Select.Option value="To avoid and investigate fraud and identity theft">To avoid and investigate fraud and identity theft</Select.Option>
                        <Select.Option value="To enable energy efficiency and enhanced customer energy consumption feedback, including the collection of hourly consumption data">To enable energy efficiency and enhanced customer energy consumption feedback, including the collection of hourly consumption data</Select.Option>
                        <Select.Option value="To reduce energy and revenue theft which may include the collection of outage, voltage, load profile and consumption information">To reduce energy and revenue theft which may include the collection of outage, voltage, load profile and consumption information</Select.Option>
                        <Select.Option value="To further develop, enhance and market products and services offered by FortisBC, which may include contacting our customers to offer them energy efficiency rebates or other programs">To further develop, enhance and market products and services offered by FortisBC, which may include contacting our customers to offer them energy efficiency rebates or other programs</Select.Option>
                        <Select.Option value="To understand customer needs and preferences, which may include contacting our customers to ask them to participate in a survey regarding our programs and services">To understand customer needs and preferences, which may include contacting our customers to ask them to participate in a survey regarding our programs and services</Select.Option>
                        <Select.Option value="To meet legal and regulatory requirements">To meet legal and regulatory requirements</Select.Option>
                        <Select.Option value="To manage FortisBC's business and operations">To manage FortisBC's business and operations</Select.Option>
                        <Select.Option value="To help ensure the security of FortisBC premises and physical assets">To help ensure the security of FortisBC premises and physical assets</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="List the individuals accountable for the personal information"
                           name="individualsAccountable"
                           rules={[
                               {
                                   required: true,
                                   message: 'Please list individuals',
                               },
                               {
                                   validator(_, value) {
                                       if (value !== "") {
                                           return Promise.resolve();
                                       }
                                       else{
                                           return Promise.reject()
                                       }
                                   }
                               },
                           ]}>

                    <CKEditor
                        disabled={this.state.isReadOnly}
                        config={{
                            toolbar: ['heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList']
                        }}
                        editor={classicEditor}
                        data={this.state.individualsInfo}
                        init={{
                            height: 200,
                            menubar: false
                        }}
                        onChange={(event, editor) => {
                            this.setState({individualsInfo: editor.getData()})
                            this.formRef.current.setFieldsValue({
                                "individualsAccountable": editor.getData()
                            })
                        }}
                    />
                </Form.Item>


                <Form.Item initialValue={window.location.pathname.includes(":") ? this.state.isDisclosed ? '1' : '2' : undefined} label="Is any information being disclosed or stored outside of Canada as part of this project?" name="isDisclosed"
                           rules={[{ required: true, message: 'Please select an option' }]}>
                    <Radio.Group disabled={this.state.isReadOnly} style={{fontWeight: "400"}} onChange={(e) => { this.setState({isDisclosed: e.target.value === '1'})} }>
                        <Radio style={{fontSize: "15px"}}  value={'1'}>Yes</Radio>
                        <Radio style={{fontSize: "15px"}} value={'2'}>No</Radio>
                    </Radio.Group>


                </Form.Item>

                {this.state.isDisclosed ?
                    <Form.Item label="What information being disclosed or stored outside of Canada as part of this project??"
                               name="disclosedInformation"
                               rules={[
                                   {
                                       required: true,
                                       message: 'Please enter the disclosed information',
                                   },
                                   {
                                       validator(_, value) {
                                               if (value !== "") {
                                                   return Promise.resolve();
                                               }
                                               else{
                                                   return Promise.reject()
                                               }
                                       }
                                   },
                               ]}
                    >

                        <CKEditor
                            disabled={this.state.isReadOnly}
                            config={{
                                toolbar: ['heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList']
                            }}
                            editor={classicEditor}
                            data={this.state.disclosedInfo}
                            init={{
                                height: 200,
                                menubar: false
                            }}
                            onChange={(event, editor) => {
                                this.setState({disclosedInfo: editor.getData()})
                                this.formRef.current.setFieldsValue({
                                    "disclosedInformation": editor.getData()
                                })
                            }}

                        />
                    </Form.Item>
                    :
                    null
                }
                {this.getFormFooter()}
            </Form>
        )
    }

    getFormFooter = () => {
        return (
            this.state.isEdit && localStorage.getItem("isOfficer") === "true" ?
                <Row style={{paddingTop: "5px"}}>
                    <div className="btn">
                        <Button disabled={this.state.isReadOnly}
                                style={{color: this.state.isReadOnly? "rgba(0,0,0,.25)" : "black", borderColor: this.state.isReadOnly ? "#d9d9d9!important" : "#FFC82C!important", background: this.state.isReadOnly ? "#f5f5f5!important" : "#FFC82C"}}
                                type="default" onClick={e=>this.onSubmit(e)}
                                >Save</Button>
                    </div>
                    <div className="btn" style={{paddingLeft: "15px"}}>
                        <Link to="/">
                            <Button type="default" onClick={() => {
                            }}
                                    style={{background: "#ffffff", color: "black"}}>Back</Button>
                        </Link>
                    </div>
                    <div className="btn" style={{paddingLeft: "15px"}}>
                        <Button disabled={this.state.isReadOnly} type="primary" danger onClick={e=>this.onSubmit(e, "REJECTED")}>Reject</Button>
                    </div>
                    <div style={{paddingLeft: "15px"}}>
                        <Button className={this.state.isReadOnly ? "" : "approveButton"} disabled={this.state.isReadOnly} style={{color: this.state.isReadOnly? "rgba(0,0,0,.25)" : "", borderColor: this.state.isReadOnly ? "#d9d9d9!important" : "#4e8a00", background: this.state.isReadOnly ? "#f5f5f5!important" : "#4e8a00"}}
                                type="primary" onClick={e=>this.onSubmit(e, "APPROVED")}>Approve</Button>
                    </div>
                </Row>
                :
                this.state.isEdit ?

                    <Row style={{paddingTop: "5px"}}>
                        <div className="btn">
                            <Button disabled={this.state.isReadOnly} type="default" onClick={e=>this.onSubmit(e)}
                                    style={{color: this.state.isReadOnly? "rgba(0,0,0,.25)" : "black", borderColor: this.state.isReadOnly ? "#d9d9d9!important" : "#FFC82C!important", background: this.state.isReadOnly ? "#f5f5f5!important" : "#FFC82C"}}
                            >Save</Button>
                        </div>
                        <div className="btn" style={{paddingLeft: "15px"}}>
                            <Link to="/">
                                <Button type="default" onClick={() => {}}
                                        style={{background: "#ffffff", color: "black"}}>Back</Button>
                            </Link>
                        </div>
                    </Row>
                    :
                    <Row style={{paddingTop: "5px"}}>
                        <div className="btn">
                            <Button type="default" onClick={e=>this.onSubmit(e)}
                                    style={{background: "#FFC82C", color: "black", borderColor: "#FFC82C!important"}}>Submit</Button>
                        </div>
                        <div className="btn" style={{paddingLeft: "15px"}}>
                            <Link to="/">
                                <Button type="default" onClick={() => {}}
                                        style={{background: "#ffffff", color: "black"}}>Back</Button>
                            </Link>
                        </div>
                    </Row>
        )
    }

    render(){
        return (

            <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100% - 100px)", width: "100%", paddingTop: "100px", zIndex: 1}}>
                <Skeleton style={{padding: this.state.isSkeleton ? "10rem" : ""}} loading={this.state.isSkeleton}>
                    <Col span={16} style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%"}}>
                        {this.newPia()}
                    </Col>
                    <Draggable
                        bounds="parent"
                        axis="both"
                        onStart={() => {}}
                        onDrag={() => {}}
                        onStop={() => {}}>
                        <div>
                            <CommentInterface isReadOnly={this.state.isReadOnly} author={this.props.email} onComment={this.onComment} comments={this.state.comments}/>
                        </div>

                    </Draggable>
                </Skeleton>
            </div>

        );
    }
}
