

import React, { Component } from 'react';

import './BasicTable.scss';

export default class BasicTable extends Component {
  static displayName = 'BasicTable';

  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <a
          href="http://127.0.0.1:8080/"
          target="_blank"
          rel="noopener noreferrer"
        >
          测试网
        </a>
      </div>
    );
  }
}
