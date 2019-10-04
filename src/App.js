import React from 'react';
import './App.css';
import {Label,Grid, Responsive, Card, Icon, Segment, Dropdown, Checkbox, Header, Button, Input} from "semantic-ui-react";
var uuid = require('uuid');

class App extends React.Component{
    state={
        prevgpa: 0,
        prevhours: 0,
        curhours: 0,
        hours: 0,        
        currentTerm : 0,
        cumulative : 0,
    };
    style={
        position: 'fixed',
        bottom: 0,
        width: '100%',
    };
    handlePrevGPA = (prevGPA)=>{
        this.setState({
            prevgpa: Number(prevGPA),
        },()=>{
            this.handleCumChange();
        });
    };

    handleprevHours = (hours)=>{
        hours=Number(hours);
        this.setState({
            prevhours: hours,
            hours : this.state.curhours + hours,
        },()=>{
            this.handleCumChange();
        });
    };

    handleChange = (currentGPA) =>{
        this.setState({
            currentTerm: Number(currentGPA),
        },()=>{
            this.handleCumChange();
        });
    };
    handleHours = (hours)=>{
        hours=Number(hours);
        this.setState({
            curhours : hours,
            hours: this.state.prevhours+hours,
        },()=>{
            this.handleCumChange();
        });
    };
    
    handleCumChange=()=>{
        let prevgrade = this.state.prevgpa * this.state.prevhours;
        let curgrade = this.state.currentTerm * this.state.curhours;

        this.setState({
            cumulative : (prevgrade+curgrade)/this.state.hours,
        });
    };
    render() {
        return (
            <>
            <div className='ui main'>
                <Header as='h1' center="true" textAlign='center'  style={{padding:'10px'}} dividing >
                    Helwan GPA Calculator
                </Header>
                <Grid columns={1}>
                    <Grid.Column>
                        <Responsive>
                            <div className='subjects'>
                                <PrevGPA
                                    handlePrevGPA = {this.handlePrevGPA}
                                    handleprevHours = {this.handleprevHours}
                                />
                                <b>Current Term GPA : {this.state.currentTerm?this.state.currentTerm.toFixed(2):"0.00"} </b>
                                <br/>
                                <b>Cumulative GPA : {this.state.cumulative?this.state.cumulative.toFixed(2):"0.00"} </b>
                                <br/>
                                <b>Hours : {this.state.hours} </b>
                                <SubjectList
                                    onChange = {this.handleChange}
                                    onHours = {this.handleHours}
                                />
                            </div>

                        </Responsive>
                    </Grid.Column>
                    
                </Grid>
                
                <footer>
                    <Segment as='a' href={'http://github.com/ahmeed2m'}  target="_blank">
                        Show some love on <Icon name='github'/>
                    </Segment>
                    <Segment as='a' href={'http://fb.com/ahmeed2m'}  target="_blank">
                        Made By Mohamadeen
                    </Segment>
                </footer>
            </div>
            </>
        );
    }
}

class PrevGPA extends React.Component{
    handlePrevGPA=  (e,data)=>{
        let gpa=data.value
        if(gpa>0){
            this.props.handlePrevGPA(gpa);
        }
    }
    handleHours=  (e,data)=>{
        let hours=Number(data.value);
        this.props.handleprevHours(hours);
    }
    render() {
        return(
            <Card centered>
                <Label style={{'marginRight':'0px'}}>Previous GPA</Label>
                <Input type='number' min='1' onChange={this.handlePrevGPA}/>
                <Label style={{'marginRight':'0px','marginLeft':'0px'}}>Previous Completed Hours</Label>
                <Input type='number' min='1' onChange={this.handleHours}/>
            </Card>
        );
    }
}
class SubjectList extends React.Component {
    state = {
        subjects:[],
    };
    createSubject = (subject) => {
        const s = {
                grade:  subject.grade||'',
                checked: subject.checked || false,
                key: uuid.v4(),
            };
        this.setState({
            subjects: this.state.subjects.concat(s),
        });
    };
    handleChange = (attrs) =>{
        this.setState({
            subjects: this.state.subjects.map((subject) => {
                if (subject.key === attrs.key) {
                    return Object.assign({}, subject, {
                        grade: attrs.subjectGPA,
                        checked: attrs.checked,
                    });
                } else {
                    return subject;
                }
            }),
        },()=>{
            let data = this.calc()
            this.props.onChange(data[0]);
            this.props.onHours(data[1]);
        });
    }
    calc = () =>{
        let hours=0;
        let score = 0;
        this.state.subjects.map((subject) => {
            let credit = (subject.checked)?2:3;
            hours+=credit;
            score+= (credit*subject.grade);
        });
        return [score/hours,hours];
    }
    handleRemove = (subId) => {
        this.setState({
            subjects: this.state.subjects.filter(s=> s.key !== subId)
        },()=>{
            let data = this.calc()
            data[0] = data[0]? data[0] : 0;
            data[1] = data[1]? data[1] : 0;
            this.props.onChange(data[0]);
            this.props.onHours(data[1]);
        });
    }
    render(){
        const all = this.state.subjects.map((subject)=>(
            <Subject
                subjectGPA = {subject.grade}
                checked = {subject.checked}
                key = {subject.key}
                id = {subject.key}
                onSubjectChange = {this.handleChange}
                onSubjectRemove = {this.handleRemove}
            />
        ));
        return(
            <>
            <div>
                {all}
            </div>
            <div className='ui basic content center aligned segment'>
                <ToggleableNewSubjectForm
                    onSubmit={this.createSubject}
                />
            </div>
            </>
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
        key:'',
    };
    componentDidMount=()=>{
        this.setState({
            checked: this.props.checked,
            subjectGPA: this.props.subjectGPA,
            key:this.props.id,
        }, () => { if (!this.props.form)
            this.props.onSubjectChange(this.state); });
    };

    handleGradeChange =(e,{value}) =>{
        this.setState({
            checked: this.state.checked,
            subjectGPA: value,
            key:this.props.id,
        }, () => { if (!this.props.form)
            this.props.onSubjectChange(this.state); });
    };
    handleCheck=()=>{
        this.setState({
            checked: (!this.state.checked),
            subjectGPA: this.state.subjectGPA,
            key:this.props.id,
        }, () => { if (!this.props.form)
            this.props.onSubjectChange(this.state); });
    };
    handleRemove=()=>{
        this.props.onSubjectRemove(this.state.key);
    }
    handleSubmit = ()=>{
        this.props.onSubmit({
            grade:this.state.subjectGPA,
            checked:this.state.checked,
            key:this.props.id,
        })
    };
    render() {
        return(
            <>
                <Card
                     centered
                >
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
                        value={this.state.subjectGPA}
                    />
                    <Card.Content 
                        extra
                        className={ this.props.form?'SubjectForm' :null }>
                        { !this.props.form ?
                        <Button
                            floated={'right'}
                            icon={'trash'}
                            color={'red'}
                            basic
                            onClick={this.handleRemove}
                        />
                        :null
                        }
                        Subject GPA : {this.state.subjectGPA}
                        <br/>
                        Hours : {(this.state.checked)?'2':'3'}
                    </Card.Content>
                </Card>
                { this.props.form && this.state.subjectGPA!==""? <Button 
                    centered="true"
                    icon='plus'
                    onClick = {this.handleSubmit}
                />: null }
                
            </>
        );
    }
}

class ToggleableNewSubjectForm extends React.Component{
    state = {
        isOpen:false,
    };
    handleOpen = ()=>{
        this.setState({isOpen:true});
    };
    handleFormClose  = ()=>{
        this.setState({isOpen:false});
    };
    handleFormSubmit  = (subject)=>{
        this.props.onSubmit(subject);
        this.setState({isOpen:false});
    };
    render() {
        if (this.state.isOpen) {
            return (
                <Subject
                    onSubmit = {this.handleFormSubmit}
                    form = {true}
                />
            );
        } else {
            return (
                <Button
                    centered="true"
                    icon='plus'
                    onClick = {this.handleOpen}
                />
            );
        }
    }
}
export default App;
