import React, {useState, useEffect} from 'react';
import './App.css';
import {Label, Card, Icon, Segment, Dropdown, Checkbox, Header, Button, Input} from "semantic-ui-react";
var uuid = require('uuid');

const App = () =>{
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
                Helwan GPA Calculator
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

            <footer style={{paddingTop:'30px'}}>
                <Segment as='a' href={'http://github.com/ahmeed2m'}  target="_blank">
                    Show some love on <Icon name='github'/>
                </Segment>
                <Segment as='a' href={'http://fb.com/ahmeed2m'}  target="_blank">
                    Made By Mohamadeen
                </Segment>
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
            <Label style={{'marginRight':'0px'}}>Previous GPA</Label>
            <Input type='number' min='1' onChange={handlePrevGPA}/>
            <Label style={{'marginRight':'0px','marginLeft':'0px'}}>Previous Completed Hours</Label>
            <Input type='number' min='1' onChange={handleHours}/>
        </Card>
    );
}

class SubjectList extends React.Component {
    state = {
        subjects:[
            {
                grade:'',
                checked:false,
                key: uuid.v4(),
            },{
                grade:'',
                checked:false,
                key: uuid.v4(),
            },{
                grade:'',
                checked:false,
                key: uuid.v4(),
            },{
                grade:'',
                checked:false,
                key: uuid.v4(),
            },{
                grade:'',
                checked:false,
                key: uuid.v4(),
            },{
                grade:'',
                checked:false,
                key: uuid.v4(),
            },
        ],
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
            <div className="SubjectList">
                <div className="subjects">
                    {all}
                </div>
                <div className="plusButton">
                    <ToggleableNewSubjectForm
                        onSubmit={this.createSubject}
                    />
                </div>
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
            <>
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
                            floated={'right'}
                            icon={'trash'}
                            color={'red'}
                            basic
                            onClick={this.handleRemove}
                        />
                        Subject GPA : {this.state.subjectGPA}
                        <br/>
                        Hours : {(this.state.checked)?'2':'3'}
                    </Card.Content>
                </Card>
                
            </>
        );
    }
}

const ToggleableNewSubjectForm = (props) =>{

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
            onClick = {handleOpen}
        />
    );
}
export default App;

