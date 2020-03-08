import React, {useState, useEffect} from 'react';
import './App.css';
import {Label, Card, Icon, Dropdown, Checkbox, Header, Button, Input} from "semantic-ui-react";
import {CSSTransition,TransitionGroup} from 'react-transition-group';
var uuid = require('uuid');

const App = (props) =>{
    const [PrevGPA, setPrevGPA] = useState(0);
    const [PrevHours, setPrevHours] = useState(0);
    const [CurHours, setCurHours] = useState(0);
    const [Hours, setHours] = useState(0);
    const [AttempedHours, setAttHours] = useState(0);
    const [CurTermGPA, setCurTermGPA] = useState(0);
    const [Cumulative, setCumulative] = useState(0);

    useEffect(()=> {handleCumChange()});

    function handlePrevGPA(PrevGPA) {
        setPrevGPA(PrevGPA);
    };

    function handlePrevHours(PrevHours) {
        setPrevHours(PrevHours);
    };

    function handleChange(currentGPA) {
        setCurTermGPA(currentGPA);
    };

    function handleHours(hours) {
        hours=Number(hours);
        setCurHours(hours);
        setHours(PrevHours+hours);
    };

    function handleCumChange() {
        let prevgrade = PrevGPA * PrevHours;
        let curgrade = CurTermGPA * CurHours;
        setCumulative((prevgrade+curgrade)/Hours);
    };
    return (
        <div className='ui main'>
            <Header as='h1' textAlign='center'  style={{padding:'10px'}} dividing >
                FCAIH GPA Calculator
            </Header>
            <Prev
                handlePrevGPA = {handlePrevGPA}
                handleprevHours = {handlePrevHours}
            />
            <div className="info">
                <b>Current Term GPA : {CurTermGPA?CurTermGPA.toFixed(2):"0.00"} </b>
                <br/>
                <b>Cumulative GPA : {Cumulative?Cumulative.toFixed(2):"0.00"} </b>
                <br/>
                <b>Hours : {Hours} </b>
            </div>
            <SubjectList
                subjects = {props.subjects}
                onChange = {handleChange}
                onHours = {handleHours}
            />
            <footer style={{paddingTop:'30px'}} className='bla'>
                <a as='a' href={'https://github.com/Ahmeed2m/helwan-gpa'} rel="noopener noreferrer" target="_blank">
                    <Icon name='github' size='big' style={{'marginBottom':'9px'}}/>
                </a>
            </footer>
        </div>
    );
}

const Prev = (props) =>{
    function handlePrevGPA(e,data){
        let gpa=data.value
        if(gpa>0){
            props.handlePrevGPA(gpa);
        }
    }

    function handleHours(e,data){
        props.handleprevHours(Number(data.value));
    }
    
    return(
        <Card>
            <Label id="prev-gpa" style={{'marginRight':'0px'}}>Previous GPA</Label>
            <Input for="prev-gpa" type='number' min='1' onChange={handlePrevGPA}/>
            <Label id="prev-hours" style={{'marginRight':'0px','marginLeft':'0px'}}>Previous Completed Hours</Label>
            <Input for="prev-hours" type='number' min='1' onChange={handleHours}/>
        </Card>
    );
}

const SubjectList = (props) => {
    const [subjects,setSubjects] = useState(props.subjects)

    function createSubject(subject) {
        const s = {
                grade:  subject.grade||'',
                checked: subject.checked || false,
                key: uuid.v4(),
            };
        setSubjects([...subjects,s])
    };
    function handleChange(attrs){
        let newSubjects = subjects.map((subject) => {
                            if (subject.key === attrs.key) {
                                return Object.assign({}, subject, {
                                    grade: attrs.subjectGPA,
                                    checked: attrs.checked,
                                });
                            } else {
                                return subject;
                            }
                        })
        setSubjects(newSubjects);
    }
    useEffect (()=>{
        let data = calc()
        data[0] = data[0]? data[0] : 0
        data[1] = data[1]? data[1] : 0
        props.onChange(data[0])
        props.onHours(data[1])
    })
    function calc() {
        let hours=0;
        let score = 0;
        subjects.map((subject) => {
            let credit = (subject.checked)?2:3;
            hours+=credit;
            score+= (credit*subject.grade);
        });
        return [score/hours,hours];
    }
    function handleRemove (subId){
        setSubjects(subjects.filter(s=> s.key !== subId));
    }

    const all = subjects.map((subject)=>(
        <CSSTransition
                    key={subject.key}
                    timeout={{
                        enter: 500,
                        exit: 50,
                    }}
                    classNames="move"
        >
        <Subject
            subjectGPA = {subject.grade}
            checked = {subject.checked}
            key = {subject.key}
            id = {subject.key}
            onSubjectChange = {handleChange}
            onSubjectRemove = {handleRemove}
        />
        </CSSTransition>
    ));
    return(
        <div className="SubjectList">
            <TransitionGroup className={"subject-list"&&"subjects"} >     
            {all}
            </TransitionGroup>
            <div className="plusButton">
                <NewSubject
                    onSubmit={createSubject}
                />
            </div>
        </div>
    );

}

const grades = [
    {value: '4.0', text:'A+'},
    {value: '3.75', text:'A'},
    {value: '3.4', text:'B+'},
    {value: '3.1', text:'B'},
    {value: '2.8', text:'C+'},
    {value: '2.5', text:'C'},
    {value: '2.25', text:'D+'},
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
    render() {
        return(
            <Card>
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
                >
                    <Button
                        aria-label="remove subject"
                        floated={'right'}
                        icon={'trash'}
                        color={'red'}
                        inverted
                        onClick={this.handleRemove}
                        style={{padding:'10px'}}
                    />
                    Subject GPA : {this.state.subjectGPA}
                    <br/>
                    Hours : {(this.state.checked)?'2':'3'}
                </Card.Content>
            </Card> 
        );
    }
}

const NewSubject = (props) =>{

    function handleOpen (){
        let subject ={
            grade:'',
            checked:false,
            key:uuid.v4(),
        }
        props.onSubmit(subject);
    };
    return (
        <Button
            icon='plus'
            aria-label="add subject"
            onClick = {handleOpen}
        />
    );
}
export default App;

