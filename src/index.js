import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App_function';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css'
var uuid = require('uuid');

let subjects = [
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
]

ReactDOM.render(<App  subjects={subjects}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
