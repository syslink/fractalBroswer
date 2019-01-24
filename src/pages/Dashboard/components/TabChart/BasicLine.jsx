import React, { Component } from 'react';
import { Chart, Axis, Geom, Tooltip } from 'bizcharts';

export default class BasicLine extends Component {
  static displayName = 'BasicLine';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // 参考：https://alibaba.github.io/BizCharts/
    // 数据源
    const data = [
      { year: '11/1', value: 30 },
      { year: '11/2', value: 40 },
      { year: '11/3', value: 35 },
      { year: '11/4', value: 50 },
      { year: '11/5', value: 39 },
      { year: '11/6', value: 50 },
      { year: '11/7', value: 40 },
      { year: '11/8', value: 45 },
      { year: '11/9', value: 50 },
    ];

    const cols = {
      value: { min: 0 },
      year: { range: [0, 1] },
    };

    return (
      <div className="basic-line">
        <Chart
          height={300}
          data={data}
          scale={cols}
          forceFit
          padding={[40, 35, 40, 35]}
        >
          <Axis name="year" />
          <Axis name="value" />
          <Tooltip crosshairs={{ type: 'y' }} />
          <Geom type="line" position="year*value" size={2} />
          <Geom
            type="point"
            position="year*value"
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
