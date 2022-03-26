import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Comment, Avatar, Form, Button, List, Input } from 'antd';
import * as moment from "moment";
import TextArea from "antd/es/input/TextArea";
interface State{
    comments: String[],
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
            value: '',
        }
        
    }
    handleSubmit = () => {
        if (!this.state.value) {
          return;
        }
    
        this.setState({
          submitting: true,
        })};
    handleChange = e => {
        this.setState({
          value: e.target.value,
        });
      };

  render() {
    const { comments, submitting, value } = this.state;
    return (
      <div>
      <Comment 
       avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
       content={
        <Editor
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          submitting={submitting}
          value={value}
       
        />
       }
      />
      
      </div>
    )
  }
}
