/* eslint no-mixed-operators:0 */
import React, { Component } from 'react';
import { Table, Progress, Pagination } from '@icedesign/base';
import IceContainer from '@icedesign/container';

const getTableData = () => {
  return Array.from({ length: 10 }).map((item, index) => {
    return {
      txHash: '0x5b260398322b552b261fa74aa161eb74af5333cb29f15fc419b0c48420146843',
      block: 1000,
      age: '36 secs ago',
      from: '0x5b260398322b552b261fa74aa161eb74af5333cb29f15fc419b0c48420146843',
      to: '0x5b260398322b552b261fa74aa161eb74af5333cb29f15fc419b0c48420146843',
      value: '4 zip',
      txFee : 0.00044
    };
  });
};

export default class TransactionsTable extends Component {
  static displayName = 'TransactionsTable';

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
        <IceContainer className="tab-card" title="Transactions">
          <Table
            getRowClassName={(record, index) => {
              return `progress-table-tr progress-table-tr${index}`;
            }}
            dataSource={this.state.dataSource}
          >
            <Table.Column title="TxHash" dataIndex="txHash" width={150} />
            <Table.Column title="Block" dataIndex="block" width={100} />
            <Table.Column title="Age" dataIndex="age" width={100} />
            <Table.Column title="From" dataIndex="from" width={150} />
            <Table.Column title="To" dataIndex="to" width={150} />
            <Table.Column title="Value" dataIndex="value" width={100} />
            <Table.Column title="[TxFee]" dataIndex="txFee" width={100} />
            
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
