import React, { Component } from 'react';
import { Chart, Axis, Geom, Tooltip } from 'bizcharts';

import eventProxy from '../../../../utils/eventProxy';

export default class BasicLine extends Component {
  static displayName = 'BasicLine';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      txInfos:[]
    };
  }
  componentDidMount() {
  	// 监听 msg 事件
    eventProxy.on('txInfos', (msg) => {
      this.setState({
        txInfos: msg
      });
    });
  }

  render() {
    
    const cols = {
      txNum: { min: 1000 },
      blockHeight: { range: [0, 1] },
    };

    return (
      <div className="basic-line">
        <Chart
          height={300}
          data={this.state.txInfos}
          scale={cols}
          forceFit
          padding={[40, 35, 40, 35]}
        >
          <Axis name="blockHeight" />
          <Axis name="txNum" />
          <Tooltip crosshairs={{ type: 'y' }} />
          <Geom type="line" position="blockHeight*txNum" size={2} />
          <Geom
            type="point"
            position="blockHeight*txNum"
            size={4}
            shape="circle"
            style={styles.point}
          />
        </Chart>
      </div>
    );
  }
}

const styles = {
  point: {
    stroke: '#fff',
    lineWidth: 1,
  },
};
