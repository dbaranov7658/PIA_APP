import {Button} from "antd";
import * as React from "react";
import {config } from '../azure/Config';
import {PublicClientApplication} from '@azure/msal-browser';
//import "../CSS/Login.css"

interface State {
    error: string;
    isAuthenticated: boolean;
    user: object;
    username: string;
    name: string;
    clientId: string;
    pcl: PublicClientApplication
}

interface Props {
    setId?: (value:string) => void,
    setEmail?: (value:string) => void,
}

class Login extends React.Component<Props, State>  {
    //https://www.youtube.com/watch?v=4pH5spE2Yss

    constructor(props: any){
        super(props);
        this.state ={
            error: undefined,
            isAuthenticated: false,
            user: {},
            username: undefined,
            name: undefined,
            clientId: undefined,
            pcl: undefined,
        };
    }

    async login() {
        try{
            await this.state.pcl.loginPopup(
                {
                    scopes: config.scopes,
                    prompt: "select_account"
                });
                this.setState({isAuthenticated:true})
                //this.setState({clientId : this.state.pcl.getConfiguration().auth.clientId})
                this.setState({clientId: this.state.pcl.getAllAccounts()[0].localAccountId});
                this.setState({username: this.state.pcl.getAllAccounts()[0].username});
                this.props.setEmail(this.state.pcl.getAllAccounts()[0].username)
                this.props.setId(this.state.pcl.getAllAccounts()[0].localAccountId)
                this.setState({name: this.state.pcl.getAllAccounts()[0].name});
            }
        catch(err){
            this.setState({
                isAuthenticated: false,
                user: {},
                error: err
            });
        }
    }

    getPublicClientApplication = () => {
        this.state.pcl = new PublicClientApplication({
            auth: {
                clientId: config.appId,
                redirectUri: config.redirectUri,
                authority: config.authority
            },
            cache: {
                cacheLocation: "sessionStorage",
                storeAuthStateInCookie: true
            }
        });
    }

    logout = () => {
        this.state.pcl.logoutPopup();
    }


    componentDidMount() {
        this.login()
        this.getPublicClientApplication()
    }

    render(){
        return (
        <div className="login">
        test 2

            <div id="login-section">
                {this.state.isAuthenticated ?
                <p id="success">
                    Successfully logged in, clientId: {this.state.clientId}
                    <br></br>
                    Account: {this.state.username} <br></br>
                    Name: {this.state.name}
                </p>
                :
                <div style={{width: "100vw"}}>
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/97/FortisBC_logo.svg/1280px-FortisBC_logo.svg.png" id="logo-login" style={{width: "100vw"}}/>
                    <Button size="large" style={{ background: " #173a64", borderColor: "#173a64", marginLeft:"50vw",}} type="primary" value="large" onClick={() => this.login()}  >Login</Button>
                </div>
                }
            </div>
        </div>
        );
    }
}


export default Login;