import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Label,Grid, Responsive, Card, Icon, Segment, Dropdown, Checkbox, Header, Button, Input} from "semantic-ui-react";

class App extends React.Component{
    state={};
    style={
        position: 'fixed',
        bottom: 0,
        width: '100%',

    };
    render() {
        return (
            <>
            <div className='ui main'>
                <Header as='h1' center textAlign='center'  style={{padding:'10px'}} dividing >
                    <Icon name='glide g' circular />
                    GPA Calculator
                </Header>
                <Grid columns={1}>
                    <Grid.Column>
                        <Responsive>
                            <div className='subjects'>
                                <PrevGPA/>
                                <SubjectList/>
                            </div>
                            <div className='ui basic content center aligned segment'>
                                <NewSubject/>
                            </div>
                            <Segment style={this.style}>
                                <Segment as='a' href={'http://github.com/ahmeed2m'}  target="_blank">
                                    <Icon name='like'/> me on github
                                </Segment>
                            </Segment>
                        </Responsive>
                    </Grid.Column>
                </Grid>
            </div>
            </>
        );
    }
}

class PrevGPA extends React.Component{
    render() {
        return(
            <Card centered>
                <Label style={{'margin-right':'0px'}}>Previous GPA</Label>
                <Input type='number' min='1' onChange={this.handlePrevGPA}/>
                <Label style={{'margin-right':'0px','margin-left':'0px'}}>Previous Completed Hours</Label>
                <Input type='number' min='1' onChange={this.handlePrevHours}/>
            </Card>
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
                        <Button
                            floated={'right'}
                            icon={'trash'}
                            color={'red'}
                            basic
                        />
                        Subject GPA : {this.state.subjectGPA}
                        <br/>
                        Hours : {(this.state.checked)?'2':'3'}
                    </Card.Content>
                </Card>
        );
    }
}

class NewSubject extends React.Component{
    render() {
        return (
            <Button
                centered
                icon='plus'
            />
        );
    }
}
export default App;
