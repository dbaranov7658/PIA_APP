
import { LoginOutlined } from '@ant-design/icons';
import '../CSS/App.css';
// @ts-ignore
import Login from '../Components/Login.tsx'
import * as React from "react";
// @ts-ignore
import PTable from "../Components/PTable.tsx";
import {Button, Col, Row} from "antd";
import {Routes, Route} from 'react-router-dom'

// @ts-ignore
import NewPia from "../Components/NewPia.tsx";
import {PublicClientApplication} from "@azure/msal-browser";
import {config } from '../azure/Config';


interface State {
    id: string;
    email: string
    pcl: PublicClientApplication
}

export default  class Main extends React.Component<any, State> {


    constructor(props: any) {
        super(props);
        this.state = {
            email: undefined,
            id: undefined,
            pcl: undefined
        }
    }

    getPublicClientApplication = () => {
        this.setState({pcl: new PublicClientApplication({
                auth: {
                    clientId: config.appId,
                    redirectUri: config.redirectUri,
                    authority: config.authority
                },
                cache: {
                    cacheLocation: "sessionStorage",
                    storeAuthStateInCookie: true
                }
            })})
    }

    componentDidMount() {
        this.getPublicClientApplication()
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if (this.state.email === undefined && localStorage.getItem("email") !== null){
            this.setState({email: localStorage.getItem("email") })
        }
    }

    setEmail = (newEmail: string) => {
        this.setState({email: newEmail})
    }

    setId = (newId: string) => {
        this.setState({id: newId})
    }

    logOut = () => {
        sessionStorage.clear();
        localStorage.clear()
        this.setState({email: undefined})
    }

    async isAuth()  {
        await fetch('/isUserAuth', {
            method: 'GET',
            headers: {'Content-Type': 'application/json', "x-access-token": localStorage.getItem("token")},
        }).then((response) => {
            response.json().then((res) => {
                alert(res)
            })
        })
    }

    renderMenu = () => {
        return (
            <div>
                <Row style={{height: "60px"}}>
                    <Col span={12} style={{paddingTop: "20px", paddingLeft: "25px"}}>
                        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/97/FortisBC_logo.svg/1280px-FortisBC_logo.svg.png" id="logo-login" style={{width: "20vw", height: "40px"}}/>
                    </Col>
                    <Col span={12}>
                        <Row style={{paddingRight: "25px", justifyContent: "end", alignItems: "center", height: "60px"}}>
                            <div className={'text'} style={{paddingRight: "20px"}}>{this.state.email}</div>
                            <Button ghost={true} type="link" onClick={this.logOut} shape="circle"><LoginOutlined  style={{color: "#000000"}} /></Button>
                        </Row>
                    </Col>
                </Row>

                <Routes>
                    <Route path="/addNew" element={<NewPia/>}/>
                    <Route path="/" element={<PTable/>}/>
                </Routes>
            </div>
        )
    }



    render() {
       return (

          this.state.email === undefined ?
         <Login setId={this.setId} setEmail={this.setEmail} pcl={this.state.pcl}/>
               :
         this.renderMenu()

       )
    }



}

