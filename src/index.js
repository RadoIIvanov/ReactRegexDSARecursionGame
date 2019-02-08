import React from 'react';
import ReactDOM from 'react-dom';
import {Component} from 'react';

class GameOuterStructure extends Component {

    constructor (props) {
        super(props);
    }

    render () {

        return (
            <h1>Test Might</h1>
        )

    }
}

ReactDOM.render(<GameOuterStructure/>, document.getElementById('root'));

