import * as React from 'react';
import {Comment, Avatar, Form, Button, List, Input, message} from 'antd';
import TextArea from "antd/es/input/TextArea";


interface Props{
    author: string
}

interface State{
    comments: any[],
    submitting: Boolean,
    value: String,
}


export default class commentInterface extends React.Component<Props,State> {
    constructor(props: any){
        super(props);
        this.state = {
            comments: [],
            submitting: false,
            value: "",
        }
        
    }



    CommentList = ({ comments }) => (
        <List
            dataSource={comments}
            header={`${comments.length} ${comments.length > 1 ? 'comments' : 'comment'}`}
            itemLayout="horizontal"
            renderItem={(props: any) => {
                return <Comment
                    author={<a>{this.props.author}</a>}
                    content={
                        props.content
                    }
                />
            }
            }
        />
    );

    Editor = ({ onChange, onSubmit, submitting, value }) => (
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



    handleSubmit = () => {
        if (this.state.value === "") {
            message.error("Empty comment")
        }
        else{
            this.setState({
                submitting: true,
            });

            setTimeout(() => {
                this.setState({
                    submitting: false,
                    value: '',
                    comments: [
                        {
                            author: 'Test',
                            content: <p>{this.state.value}</p>,
                            datetime: Date.now().toString(),
                        },
                        ...this.state.comments,
                    ],
                });
            }, 1000);
        }


    };
    handleChange = e => {
        this.setState({
          value: e.target.value,
        });
      };



  render() {
    return (
      <div style={{width: "100%", height: "100%"}}>
          {this.state.comments.length > 0 && <this.CommentList comments={this.state.comments} />}
          <Comment
       content={
        <this.Editor
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
