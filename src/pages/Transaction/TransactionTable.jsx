import React, { Component } from 'react';
import { Search, Grid, Table } from "@icedesign/base";
import IceContainer from '@icedesign/container';
import {getAssetInfoById, getTransactionByHash, getTransactionReceipt} from '../../api'

const { Row, Col } = Grid;

export default class TransactionTable extends Component {
  static displayName = 'TransactionTable';

  constructor(props) {
    super(props);
    this.state = {
        value: "",
        txInfo: {},
        assetInfos: {},
        actions: []
    };
  }

  onSearch = async (value) => {
    var hash = value.key;
    if (hash.indexOf("0x") == 0) {
      var resp = await getTransactionByHash([hash]);
      if (resp.data.result != undefined) {
        var transaction = resp.data.result;
        resp = await getTransactionReceipt([hash]);
        var receipt = resp.data.result;
        transaction['gasUsed'] = receipt.totalGasUsed;
        for (var i = 0; i < transaction.actions.length; i++) {
          transaction.actions[i]['result'] = receipt.actionResults[i].status == 1 ? '成功' : '失败';
          transaction.actions[i]['gasUsed'] = receipt.actionResults[i].gasUsed;
          transaction.actions[i]['error'] = receipt.actionResults[i].error;
        }
        this.setState({
          txInfo: transaction,
          actions: transaction.actions
        });
      } else {
        Feedback.toast.error('无法获取到交易信息');
      }
    } else {
      Feedback.toast.prompt('请输入十六进制的hash值');
    }
  }

  // value为filter的值，obj为search的全量值
  onFilterChange(value, obj) {
        console.log(`filter is: ${value}`);
        console.log("fullData: ", obj);
  }


  render() {
    return (
      <div>
        <IceContainer>
          <Row style={{ justifyContent: 'center' }}>
            <Col span="24" s="10" l="10">
                <Search
                    size="large"
                    autoWidth="true"
                    onSearch={this.onSearch.bind(this)}
                    placeholder="交易hash"
                    onFilterChange={this.onFilterChange.bind(this)}
                />
            </Col>
          </Row>
        </IceContainer>

        <IceContainer style={styles.container}>
            <h4 style={styles.title}>交易信息</h4>
            <ul style={styles.summary}>
              <li style={styles.item}>
                <span style={styles.label}>TxHash:</span>
                <span style={styles.value}>
                  {this.state.txInfo.txHash}
                </span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Block Height:</span>
                <span style={styles.value}>{this.state.txInfo.blockNumber}</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Block Hash:</span>
                <span style={styles.value}>{this.state.txInfo.blockHash}</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Gas Used:</span>
                <span style={styles.value}>{this.state.txInfo.gasUsed}</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Gas Price:</span>
                <span style={styles.value}>{this.state.txInfo.gasPrice}</span>
              </li>
            </ul>
          </IceContainer>
          <br/>
          <br/>
          <IceContainer>
            <h4 style={styles.title}>Action信息</h4>
            <Table
              getRowClassName={(record, index) => {
                return `progress-table-tr progress-table-tr${index}`;
              }}
              dataSource={this.state.actions}
            >
              <Table.Column title="类型" dataIndex="type" width={50} />
              <Table.Column title="发送账号" dataIndex="from" width={50} />
              <Table.Column title="接收账号" dataIndex="to" width={50} />
              <Table.Column title="资产ID" dataIndex="assetID" width={50} />
              <Table.Column title="资产金额" dataIndex="value" width={50} />
              <Table.Column title="负载信息" dataIndex="payload" width={80} />
              <Table.Column title="消耗GAS" dataIndex="gasUsed" width={50} />
              <Table.Column title="结果" dataIndex="result" width={50} />
              <Table.Column title="错误信息" dataIndex="error" width={50} />
            </Table>
         </IceContainer>
      </div>
    );
  }
}

const styles = {
    container: {
      margin: '0',
      padding: '0',
    },
    title: {
      margin: '0',
      padding: '15px 20px',
      fonSize: '16px',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      color: 'rgba(0,0,0,.85)',
      fontWeight: '500',
      borderBottom: '1px solid #eee',
    },
    summary: {
      padding: '20px',
    },
    item: {
      height: '40px',
      lineHeight: '40px',
    },
    label: {
      display: 'inline-block',
      fontWeight: '500',
      minWidth: '74px',
      width: '150px'
    },
  };