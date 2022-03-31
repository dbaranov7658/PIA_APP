import * as React from 'react';
import {Comment, Form, Button, List, message} from 'antd';
import TextArea from "antd/es/input/TextArea";
import {comment} from "../consts/interfaces";



interface Props{
    author: string
    onComment: (value:comment) => void,
    comments: comment[]

}

interface State{
    submitting: boolean,
    value: string,
}

export default class commentInterface extends React.Component<Props,State> {
    constructor(props: any){
        super(props);
        this.state = {
            submitting: false,
            value: "",

        }
        
    }

    CommentList = ({ comments }) => (
        <List
            style={{maxHeight: "300px", overflow: "auto"}}
            dataSource={comments}
            header={`${comments.length} ${comments.length > 1 ? 'comments' : 'comment'}`}
            itemLayout="horizontal"
            renderItem={(props: any) => {
                return <Comment
                    author={<div>{props.author}</div>}
                    content={
                        <p style={{ width: "fit-content", textAlign: this.props.author !== props.author ? "right":"left",
                            backgroundColor: this.props.author !== props.author ? "#eee": "#163a64",
                            color: this.props.author !== props.author ? "black":"#eee",
                            borderRadius:"10px",
                            padding:"10px",
                            float: this.props.author !== props.author ? "left":"right"

                        }}>{props.content}</p>

                    }
                    datetime={props.date}
                />
            }
            }
        />
    );


    Editor = ({ onChange, onSubmit, submitting, value }) => (
        <>
            <Form.Item>
                <TextArea rows={4} onChange={onChange} value={value} placeholder="Add a comment..."/>
            </Form.Item>
            <Form.Item>
                <Button className={"commentButton"} htmlType="submit" loading={submitting} onClick={onSubmit} type="primary"
                        style={{color:"black", marginLeft:"4px", backgroundColor: "rgb(255, 200, 44)", borderColor: "rgb(255, 200, 44)"}}>
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
            let newContent = this.state.value
            setTimeout(() => {
                let newComment: comment = {author: this.props.author, content: newContent, date: new Date().toISOString().slice(0, 10).toString()}
                this.props.onComment(newComment)
                this.setState({
                    submitting: false,
                    value: ""
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
      <div style={{width: "300px"}}>
          {this.props.comments.length > 0 && <this.CommentList comments={this.props.comments} />}
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
