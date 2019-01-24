import React, { Component } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/eclipse.css';


export default class ContractEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: ""
        }
    }
    render() {
        return (
            <div>
                <CodeMirror
                value={this.state.code}
                options={{
                    theme: 'eclipse',
                    tabSize: 2,
                    keyMap: 'sublime',
                    mode: 'jsx',
                }}
                />
            </div>
        )  
    }
}
