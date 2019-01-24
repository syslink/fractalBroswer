/* eslint no-mixed-operators:0 */
import React, { Component } from 'react';
import { Table, Progress, Pagination } from '@icedesign/base';
import IceContainer from '@icedesign/container';

const getTableData = () => {
  return Array.from({ length: 10 }).map((item, index) => {
    return {
      height: 1000,
      age: '42 secs ago',
      txn: 300,
      gasUsed: 7999999,
      gasLimit: 8000000,
      avgGasPrice: '15 Gwei',
      reward : '5000 zip'
    };
  });
};

export default class BlocksTable extends Component {
  static displayName = 'BlocksTable';

  constructor(props) {
    super(props);

    this.state = {
      dataSource: getTableData(),
      current: 1,
    };
  }

  renderCellProgress = value => (
    <Progress showInfo={false} percent={parseInt(value, 10)} />
  );

  onPageChange = (pageNo) => {
    this.setState({
      current: pageNo,
    });
  };

  render() {
    return (
      <div className="progress-table">
        <IceContainer className="tab-card" title="Blocks">
          <Table
            getRowClassName={(record, index) => {
              return `progress-table-tr progress-table-tr${index}`;
            }}
            dataSource={this.state.dataSource}
          >
            <Table.Column title="Height" dataIndex="height" width={100} />
            <Table.Column title="Age" dataIndex="age" width={200} />
            <Table.Column title="txn" dataIndex="txn" width={100} />
            <Table.Column title="GasUsed" dataIndex="gasUsed" width={100} />
            <Table.Column title="GasLimit" dataIndex="gasLimit" width={100} />
            <Table.Column title="Avg.GasPrice" dataIndex="avgGasPrice" width={100} />
            <Table.Column title="Reward" dataIndex="reward" width={100} />
            
          </Table>
          <div style={styles.paginationWrapper}>
            <Pagination
              current={this.state.current}
              onChange={this.onPageChange}
              shape="arrow-only"
            />
          </div>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  paginationWrapper: {
    display: 'flex',
    padding: '20px 0 0 0',
    flexDirection: 'row-reverse',
  },
};
