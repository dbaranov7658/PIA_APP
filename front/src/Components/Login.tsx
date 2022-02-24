
import '../CSS/App.css';
import {Button, Col, Row} from "antd";

function Login() {
  return (
    <div style={{height: '100vh', width: '100vw'}}>
     <Row style={{height: "30%", backgroundColor: "red"}} >
        <Button>
            testttttt
        </Button>
     </Row>
        <Row style={{height: "40%"}}>
            <Col span={6} style={{backgroundColor: "green"}}>
                test1
            </Col>
            <Col span={12} style={{backgroundColor: "blue"}}>
                test2
            </Col>
            <Col span={6} style={{backgroundColor: "yellow"}}>
            test3
            </Col>

        </Row>
    </div>
  );
}

export default Login;
