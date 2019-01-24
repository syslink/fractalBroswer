import React, { Component } from 'react';
import EditableTable from './components/EditableTable';

export default class AccountManager extends Component {
  static displayName = 'AccountManager';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="accountmanager-page">
        <EditableTable />
      </div>
    );
  }
}
