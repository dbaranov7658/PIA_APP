import * as React from "react";
import '../CSS/App.css';
import { Result, Button } from 'antd';
import { Link } from "react-router-dom";

class PageNotFound extends React.Component {
    render() {
        return (
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Link to="/">
                        <Button style={{backgroundColor: "#ffc82c", color: "#173a64", border: "none"}} type="primary">Go back home</Button>
                    </Link>
                }
                style={{paddingTop: "15rem"}}
            />
        );
    }
}

export default PageNotFound;