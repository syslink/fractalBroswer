import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Input } from '@alifd/next';

export default class Logo extends PureComponent {
  render() {
    return (
      <div className="logo" style={{}}>
        <Link to="/" className="logo-text">
          FRACTAL
          <Tag type="normal" size="small">test-net</Tag>
        </Link>
      </div>
    );
  }
}
