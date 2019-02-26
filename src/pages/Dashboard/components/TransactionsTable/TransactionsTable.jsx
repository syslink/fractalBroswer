/* eslint no-mixed-operators:0 */
import React, { Component } from 'react';
import { Table, Progress, Pagination } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import eventProxy from '../../../../utils/eventProxy';
import {  getBlockByNum } from '../../../../api';
import {getAssetInfo, getTransactionReceipt} from '../../../../api'

import {decode} from 'rlp'
import BigNumber from "bignumber.js"
import { hex2Bytes } from '../../../../utils/utils';
import * as txParser from '../../../../utils/transactionParser';
import * as actionTypes from '../../../../utils/constant';

export default class TransactionsTable extends Component {
  static displayName = 'TransactionsTable';

  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
      current: 1,
      assetInfos: {},
    };
  }
  getReadableNumber = (value, assetID) => {
    let {assetInfos} = this.state;
    var decimals = assetInfos[assetID].decimals;

    var renderValue = new BigNumber(value);
    renderValue = renderValue.shiftedBy(decimals * -1);
    
    BigNumber.config({ DECIMAL_PLACES: 6 });
    renderValue = renderValue.toString(10);
    return renderValue;
  }

  componentDidMount() {
  	
    eventProxy.on('curHeight', async (msg) => {
      var curHeight = msg;
      var resp = await getBlockByNum([curHeight, true]);
      var curBlockInfo = resp.data.result; 
      var transactions = [];
      for (let transaction of curBlockInfo.transactions) {
        txParser.parseAction(transaction, )

        var actionInfo = transaction.actions[0];
        
        if (this.state.assetInfos[actionInfo.assetID] == undefined) {
          var resp = await getAssetInfo([actionInfo.assetID]);
          this.state.assetInfos[actionInfo.assetID] = resp.data.result;
        }
        var payloadInfo = '';
        if (actionInfo.payload.length > 2) {
          payloadInfo = decode(hex2Bytes(actionInfo.payload))
        }
        switch(actionInfo.type) {
          case actionTypes.TRANSFER:
            transaction['actionType'] = '转账';
            transaction['detailInfo'] = actionInfo.from + "向" + actionInfo.to + "转账" 
                                + this.getReadableNumber(actionInfo.value, actionInfo.assetID) + this.state.assetInfos[actionInfo.assetID].symbol;
            break;
          case actionTypes.CREATE_NEW_ACCOUNT:
            transaction['actionType'] = '创建账户';
            transaction['detailInfo'] = actionInfo.from + "创建账户：" + actionInfo.to;
            if (actionInfo.value > 0) {
              transaction['detailInfo'] += "并转账" + this.getReadableNumber(actionInfo.value, actionInfo.assetID) + assetInfos[actionInfo.assetID].symbol;
            }     
            break;   
          case actionTypes.UPDATE_ACCOUNT:  
            transaction['actionType'] = '更新账户';
            transaction['detailInfo'] = payloadInfo;
            break;
          case actionTypes.INCREASE_ASSET:
            transaction['actionType'] = '增发资产';
            transaction['detailInfo'] = payloadInfo;
            break;
          case actionTypes.ISSUE_ASSET:
            transaction['actionType'] = '发行资产';
            transaction['detailInfo'] = payloadInfo;
            break;
          case actionTypes.DESTORY_ASSET:
            transaction['actionType'] = '销毁资产';
            transaction['detailInfo'] = payloadInfo;
            break;
          case actionTypes.SET_ASSET_OWNER:
            transaction['actionType'] = '设置资产所有者';
            transaction['detailInfo'] = payloadInfo;
            break;
          case actionTypes.SET_ASSET_FOUNDER:
            transaction['actionType'] = '设置资产创建者';
            transaction['detailInfo'] = payloadInfo;
            break;
          case actionTypes.REG_PRODUCER:
            transaction['actionType'] = '注册生产者';
            transaction['detailInfo'] = payloadInfo;
            break;
          case actionTypes.UPDATE_PRODUCER:
            transaction['actionType'] = '更新生产者';
            transaction['detailInfo'] = payloadInfo;
            break;
          case actionTypes.UNREG_PRODUCER:
            transaction['actionType'] = '注销生产者';
            transaction['detailInfo'] = payloadInfo;
            break;
          case actionTypes.REMOVE_VOTER:
            transaction['actionType'] = '移除投票者';
            transaction['detailInfo'] = payloadInfo;
            break;
          case actionTypes.VOTE_PRODUCER:
            transaction['actionType'] = '给生产者投票';
            transaction['detailInfo'] = payloadInfo;
            break;
          case actionTypes.CHANGE_PRODUCER:
            transaction['actionType'] = '改投生产者';
            transaction['detailInfo'] = payloadInfo;
            break;
          case actionTypes.UNVOTE_PRODUCER:
            transaction['actionType'] = '收回投票';
            transaction['detailInfo'] = payloadInfo;
            break;
        }

        var receiptResp = await getTransactionReceipt([transaction.txHash]);
        var actionResult = receiptResp.data.result.actionResults[0];
        transaction['result'] = actionResult.status == 1 ? '成功' : '失败（' + actionResult.error + '）';
        transaction['gasFee'] = actionResult.gasUsed + 'aft';
        transactions.push(transaction);
        if (transactions.length >= 20) {
          break;
        }
      }

      this.setState({
        dataSource: transactions,
      });
    });
  }

  renderCellProgress = value => (
    <Progress showInfo={false} percent={parseInt(value, 10)} />
  );

  onPageChange = (pageNo) => {
    this.setState({
      current: pageNo,
    });
  };

  actionTypeRender = (value, index) => {
    switch(value) {
      case 0:
        return '转账';
      case 256:
        return '创建账户';
      case 257:
        return '更新账户';
    }
  }

  render() {
    return (
      <div className="progress-table">
        <IceContainer className="tab-card" title="交易">
          <Table
            getRowClassName={(record, index) => {
              return `progress-table-tr progress-table-tr${index}`;
            }}
            dataSource={this.state.dataSource}
          >
            <Table.Column title="交易Hash" dataIndex="txHash" width={150} />
            <Table.Column title="区块Hash" dataIndex="blockHash" width={150} />
            <Table.Column title="类型" dataIndex="actionType" width={50} />
            <Table.Column title="详情" dataIndex="detailInfo" width={180} />
            <Table.Column title="结果" dataIndex="result" width={50} />
            <Table.Column title="手续费" dataIndex="gasFee" width={80} />
            
          </Table>
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
