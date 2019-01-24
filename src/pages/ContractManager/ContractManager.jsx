import React, { Component } from 'react';
import ContractEditor from './components/Editor';

export default class ContractManager extends Component {
  static displayName = 'ContractManager';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <ContractEditor />
      </div>
    );
  }
}
