
import { LoginOutlined } from '@ant-design/icons';
import '../CSS/App.css';
// @ts-ignore
import Login from '../Components/Login.tsx'
import * as React from "react";
// @ts-ignore
import PTable from "../Components/PTable.tsx";
import {Button, Col, Layout, Row} from "antd";
import {Routes, Route} from 'react-router-dom'

// @ts-ignore
import NewPia from "../Components/NewPia.tsx";


interface State {
    isLogged: boolean;
    id: string;
    email: string
}

export default  class Main extends React.Component<any, State> {


    constructor(props: any) {
        super(props);
        this.state = {
            isLogged: false,
            email: undefined,
            id: undefined
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {

    }

    setEmail = (newEmail: string) => {
        this.setState({email: newEmail})
    }

    setId = (newId: string) => {
        this.setState({id: newId})
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
                            <Button ghost={true} type="link" shape="circle"><LoginOutlined  style={{color: "#000000"}} /></Button>
                        </Row>
                    </Col>
                </Row>
                {/*testdfdfdfdfd*/}
                <Routes>
                    <Route path="/addNew" element={<NewPia/>}/>
                    <Route path="/" element={<PTable/>}/>
                </Routes>
            </div>
        )
    }



    render() {
       return (
           this.state.id === undefined ?
               /*testdfdfdfdfd*/
         <Login setId={this.setId} setEmail={this.setEmail}/>
               /*testdfdfdfdfd*/
               :
         this.renderMenu()
           /*testdfdfdfdfd*/

       )
    }



}

