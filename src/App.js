import React, {useState, useEffect, useContext } from 'react';
import './App.css';
import {Label, Card, Icon, Dropdown, Checkbox, Header, Button, Input} from "semantic-ui-react";
import {CSSTransition,TransitionGroup} from 'react-transition-group';
import { Context } from "./context/subjects-context";
import Types from './types';

var uuid = require('uuid');

const App = (props) =>{
    const [PrevGPA, setPrevGPA] = useState(0);
    const [PrevHours, setPrevHours] = useState(0);
    const [CurHours, setCurHours] = useState(0);
    const [Hours, setHours] = useState(0);
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
            <Input htmlFor="prev-gpa" type='number' min='1' onChange={handlePrevGPA}/>
            <Label id="prev-hours" style={{'marginRight':'0px','marginLeft':'0px'}}>Previous Completed Hours</Label>
            <Input htmlFor="prev-hours" type='number' min='1' onChange={handleHours}/>
        </Card>
    );
}

const SubjectList = (props) => {
    const [state, dispatch] = useContext(Context);

    function createSubject(subject) {
        dispatch({
            type: Types.ADD_SUBJECT,
            payload: subject,
        });
    };
    function handleChange(attrs){
        dispatch({
            type: Types.EDIT_SUBJECT,
            payload: attrs,
        });
    }
    useEffect (()=>{
        let {gpa, hours} = calc()        
        gpa = gpa? gpa : 0
        hours = hours? hours : 0
        props.onChange(gpa)
        props.onHours(hours)
    })
    function calc() {
        let hours=0;
        let attemptedHours=0;
        let score = 0;
        state.subjects.forEach((subject) => {
            let credit = (subject.checked)?2:3;
            if(subject.grade===1.0){
               attemptedHours+=credit;
               hours+=credit;
            }else{
                hours+=credit;
            }
            score+= (credit*subject.grade);
        });
        return {"gpa":score/hours,"hours":hours-attemptedHours,"attempt":attemptedHours};
    }
    function handleRemove (subId){
        dispatch({
            type: Types.DEL_SUBJECT,
            payload: subId
        });
    }
    
    return(
        <div className="SubjectList">
            <TransitionGroup className={"subject-list"&&"subjects"} >     
            {state.subjects.map((subject)=>{
                
        return (<CSSTransition
                    key={subject.key}
                    timeout={{
                        enter: 500,
                        exit: 50,
                    }}
                    classNames="move"
        >
        <Subject
            grade = {subject.grade}
            checked = {subject.checked}
            id = {subject.key}
            onSubjectChange = {handleChange}
            onSubjectRemove = {handleRemove}
        />
        </CSSTransition>)
            })}
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
    {value:4.0, text:'A+'},
    {value:3.75, text:'A'},
    {value:3.4, text:'B+'},
    {value:3.1, text:'B'},
    {value:2.8, text:'C+'},
    {value:2.5, text:'C'},
    {value: 2.25, text:'D+'},
    {value:2.0, text:'D'},
    {value:1.0, text:'F'},
];

const Subject = ({id, checked, grade, onSubjectChange, onSubjectRemove}) =>{
    
    const handleGradeChange =(e,{value}) =>{
        onSubjectChange({
            key: id,
            checked:checked,
            grade: value,
        });
    };
    const handleCheck=()=>{
            onSubjectChange({
                key: id,
                checked:!checked,
                grade: grade,
            });
        };
    const handleRemove=()=>{
        onSubjectRemove(id);
    }
        return(
            <Card>
                <Checkbox
                    label='2 Hour subject?'
                    style={{padding:'10px'}}
                    onClick={handleCheck}
                    checked={checked}
                />
                <Dropdown
                    placeholder='Grade'
                    fluid
                    selection
                    options={grades}
                    onChange={handleGradeChange}
                    value={grade}
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
                        onClick={handleRemove}
                        style={{padding:'10px'}}
                    />
                    Subject GPA : {grade}
                    <br/>
                    Hours : {(checked)?'2':'3'}
                </Card.Content>
            </Card> 
        );
}

const NewSubject = (props) =>{

    function handleOpen (){
        props.onSubmit({
            grade:String(),
            checked:false,
            key:uuid.v4(),
        });
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

