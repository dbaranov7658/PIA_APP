import * as React from 'react';
import {Comment, Avatar, Form, Button, List, Input, message} from 'antd';
import TextArea from "antd/es/input/TextArea";
interface State{
    comments: any[],
    submitting: Boolean,
    value: String,
}

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Add Comment
            </Button>
        </Form.Item>
    </>
);


export default class commentInterface extends React.Component<any,State> {
    constructor(props: any){
        super(props);
        this.state = {
            comments: [],
            submitting: false,
            value: "",
        }
        
    }
    handleSubmit = () => {
        if (this.state.value === "") {
            message.error("Empty comment")
        }
        else{

        }


    };
    handleChange = e => {
        this.setState({
          value: e.target.value,
        });
      };

  render() {
    return (
      <div>
      <Comment 
       avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
       content={
        <Editor
          onChange={(e) => { this.handleChange(e)}}
          onSubmit={() => {this.handleSubmit()}}
          submitting={this.state.submitting}
          value={this.state.value}
       
        />
       }
      />
      
      </div>
    )
  }
}
