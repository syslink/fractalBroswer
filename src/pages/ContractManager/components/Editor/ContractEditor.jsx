import React, { Component } from 'react';

import { Table, Button, Tag, Balloon, Icon } from '@alifd/next';
import * as monaco from 'monaco-editor';
import 'monaco-editor/esm/vs/basic-languages/solidity/solidity.contribution.js';
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js';
import cookie from 'react-cookies'

export default class ContractEditor extends Component {
    constructor(props) {
        super(props);
        var solCode = cookie.load('solCode');
        this.state = {
            code: solCode,
            editor: null,
        }
    }
    componentDidMount() {
        this.state.editor = monaco.editor.create(this.refs.editorContainer, {
                                                value: this.state.code,
                                                language: 'sol',
                                                lineNumbers: "on",
                                                roundedSelection: false,
                                                scrollBeyondLastLine: false,
                                                readOnly: false,
                                                theme: "vs-dark",
                                            });
        this.state.editor.onDidChangeModelContent((event) => {
            const latestCode = this.state.editor.getValue();
            cookie.save('solCode', latestCode);
        })
    }
    componentWillUnmount() {
        this.state.editor.dispose();
    }
    compile = () => {

    }
    sendToChain = () => {

    }
    render() {
        const options = {
            selectOnLineNumbers: true
        };
        return (
            <div>
                <p>
                    <Button type="primary" onClick={this.compile.bind(this)}>
                        编译
                    </Button>
                        &nbsp;&nbsp;
                    <Button type="primary" onClick={this.sendToChain.bind(this)}>
                        发布
                    </Button>
                </p> 
                <div ref='editorContainer' style={{height:800, width:1000}}/>
            </div>
        )  
    }
}
