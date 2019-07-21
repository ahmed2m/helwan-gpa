import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Card,Icon,Segment,Dropdown,Checkbox,Header} from "semantic-ui-react";

class App extends React.Component{
    state={};
    style={
        position: 'fixed',
        bottom: 0,
        width: '100%',

    };
    render() {
        return (
            <div>
                <Header as='h2' icon textAlign='center' style={{padding:'10px'}}>
                    <Icon name='glide g' circular />
                    <Header.Content>GPA Calculator</Header.Content>
                </Header>
                <Subject/>
                <Segment style={this.style}>
                    <Segment as='a' href={'http://github.com/ahmeed2m'}  target="_blank">
                        <Icon name='like'/> me on github
                    </Segment>
                </Segment>
            </div>
        );
    }
}

class SubjectList extends React.Component {
    render(){
        return(
            <div>
                <Subject/>
            </div>
        );
    }
}

const grades = [
    {value: '4.0', text:'A+'},
    {value: '3.7', text:'A'},
    {value: '3.4', text:'B+'},
    {value: '3.1', text:'B'},
    {value: '2.7', text:'C+'},
    {value: '2.4', text:'C'},
    {value: '2.1', text:'D+'},
    {value: '2.0', text:'D'},
    {value: '1.0', text:'F'},
];

class Subject extends React.Component{
    state = {
        checked: false,
        subjectGPA:'',
    };

    handleGradeChange =(e,{value}) =>{
        this.setState({
            checked: this.state.checked,
            subjectGPA: value,
        });
    };
    handleCheck=()=>{
        this.setState({
            checked: (!this.state.checked),
            subjectGPA: this.state.subjectGPA,
        });
    };
    render() {
        return(
                <Card centered>
                    <Checkbox
                        label='2 Hour subject?'
                        style={{padding:'10px'}}
                        onClick={this.handleCheck}
                        checked={this.state.checked}
                    />
                    <Dropdown
                        placeholder='Grade'
                        fluid
                        selection
                        options={grades}
                        onChange={this.handleGradeChange}
                    />
                    <Card.Content extra>
                        Subject GPA : {this.state.subjectGPA}
                        <br/>
                        Hours : {(this.state.checked)?'2':'3'}
                    </Card.Content>
                </Card>
        );
    }
}


export default App;
