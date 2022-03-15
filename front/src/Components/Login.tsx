import {Button, Row} from "antd";
import * as React from "react";
import {PublicClientApplication} from '@azure/msal-browser';
import {config } from '../azure/Config';
import '../CSS/App.css';
// @ts-ignore
import {fortisLogo} from '../consts/Photos.tsx'
// @ts-ignore
import {deleteAllCookies} from "./Main.tsx";

interface State {
}

interface Props {
    setIsOfficer?: (value:boolean) => void,
    setEmail?: (value:string) => void,
    pcl: PublicClientApplication,
}

class Login extends React.Component<Props, State>  {
    //https://www.youtube.com/watch?v=4pH5spE2Yss

    constructor(props: any){
        super(props);
        this.state ={
        };
    }

    async login() {
        deleteAllCookies()
        sessionStorage.clear();
        localStorage.clear()
        try{
            await this.props.pcl.loginPopup(
                {
                    scopes: config.scopes,
                    prompt: "select_account"
                });
            let email = this.props.pcl.getAllAccounts()[0].username

                await fetch('/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({email: email})
                }).then((response) => {
                    response.json().then((response) => {
                        if (response.auth){
                            localStorage.setItem("token", response.token)
                            this.props.setEmail(email)
                            this.props.setIsOfficer(response.isOfficer === "true")
                        }
                        else {
                            sessionStorage.clear();
                            localStorage.clear()
                            alert(response.message)
                        }

                    })
                })
            }
        catch(err){
            console.log(err)
        }
    }

    render(){
        return (
        <div className="container">
             <div className="login-section" style={{width: "60vh"}}>
               <Row className="fortisLogo">{fortisLogo}</Row>
                <Row style={{paddingRight: "10px"}}>
                <Button className="loginBtn" size="large" type="primary" value="large" onClick={() => this.login()}>Login</Button>
                </Row>
             </div>
        </div>
        );
    }
}


export default Login;