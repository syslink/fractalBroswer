import {decode} from 'rlp'
import BigNumber from "bignumber.js"

import * as actionTypes from './constant';
import { hex2Bytes, bytes2Hex } from './utils';
import {getAssetInfo} from '../api'


function getReadableNumber(value, assetDecimal) {
  var renderValue = new BigNumber(value);
  renderValue = renderValue.shiftedBy(assetDecimal * -1);
  
  BigNumber.config({ DECIMAL_PLACES: 6 });
  renderValue = renderValue.toString(10);
  return renderValue;
}

function parseAction(actionInfo, assetInfo){
  var actionParseInfo = {...actionInfo};
  var payloadInfo = '';
  if (actionInfo.payload.length > 2) {
    payloadInfo = decode(actionInfo.payload);
  }
  var readableNum = this.getReadableNumber(actionInfo.value, assetInfo.decimals);
  switch(actionInfo.type) {
    case actionTypes.TRANSFER:
      actionParseInfo['actionType'] = '转账';
      actionParseInfo['detailInfo'] = actionInfo.from + "向" + actionInfo.to + "转账" 
                                    + readableNum + assetInfo.symbol;
      actionParseInfo['detailObj'] = {from:actionInfo.from, to:actionInfo.to, value:readableNum, symbol:assetInfo.symbol};
      break;
    case actionTypes.CREATE_CONTRACT:
      actionParseInfo['actionType'] = '创建合约';
      actionParseInfo['detailInfo'] = "创建者:" + actionInfo.from;
      actionParseInfo['detailObj'] = {from:actionInfo.from};
      break;
    case actionTypes.CREATE_NEW_ACCOUNT:
      actionParseInfo['actionType'] = '创建账户';
      actionParseInfo['detailInfo'] = actionInfo.from + "创建账户:" + actionInfo.to;   
      actionParseInfo['detailObj'] = {from:actionInfo.from, to:actionInfo.to, value:readableNum, symbol:assetInfo.symbol};
      break;   
    case actionTypes.UPDATE_ACCOUNT:  
      actionParseInfo['actionType'] = '更新账户';
      var founder = String.fromCharCode.apply(null, payloadInfo[0]);
      var chargeRatio = payloadInfo[1].length == 0 ? 0 : payloadInfo[1][0];
      var publicKey = bytes2Hex(payloadInfo[2]);
      actionParseInfo['detailInfo'] = '创建者：' + founder + ', 手续费收取比例:' + chargeRatio + '%, 公钥:' + publicKey;
      actionParseInfo['detailObj'] = {founder: founder, chargeRatio:chargeRatio, publicKey:publicKey};
      break;
    case actionTypes.INCREASE_ASSET:
      actionParseInfo['actionType'] = '增发资产';
      var assetId = payloadInfo[0];
      var amount = payloadInfo[1];
      var assetInfo = {};
      if (assetId == assetInfo.assetId) {
        amount = this.getReadableNumber(amount, assetInfo.decimals);
      } 
      // else {
      //   var resp = await getAssetInfo([assetID]);
      //   assetInfo = resp.data.result;
      //   amount = this.getReadableNumber(amount, assetInfo.decimals);
      // }
      var toAccount = String.fromCharCode.apply(null, payloadInfo[2]);
      actionParseInfo['detailInfo'] = '向' + toAccount + '增发资产:资产ID=' + assetId + ', 数量:' + amount;
      actionParseInfo['detailObj'] = {assetId: assetId, assetName: assetInfo.assetname, amount: amount, toAccount: toAccount};
      break;
    case actionTypes.ISSUE_ASSET:
      actionParseInfo['actionType'] = '发行资产';
      // var	assetId
      // var	assetName
      // var	symbol
      // var	amount
      // var	decimals
      // var	founder
      // var	owner
      // var	addIssue
      // var	upperLimit
      actionParseInfo['detailInfo'] = payloadInfo;
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.DESTORY_ASSET:
      actionParseInfo['actionType'] = '销毁资产';
      actionParseInfo['detailInfo'] = payloadInfo;
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.SET_ASSET_OWNER:
      actionParseInfo['actionType'] = '设置资产所有者';
      actionParseInfo['detailInfo'] = payloadInfo;
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.SET_ASSET_FOUNDER:
      actionParseInfo['actionType'] = '设置资产创建者';
      actionParseInfo['detailInfo'] = payloadInfo;
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.REG_PRODUCER:
      actionParseInfo['actionType'] = '注册生产者';
      actionParseInfo['detailInfo'] = payloadInfo;
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.UPDATE_PRODUCER:
      actionParseInfo['actionType'] = '更新生产者';
      actionParseInfo['detailInfo'] = payloadInfo;
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.UNREG_PRODUCER:
      actionParseInfo['actionType'] = '注销生产者';
      actionParseInfo['detailInfo'] = payloadInfo;
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.REMOVE_VOTER:
      actionParseInfo['actionType'] = '移除投票者';
      actionParseInfo['detailInfo'] = payloadInfo;
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.VOTE_PRODUCER:
      actionParseInfo['actionType'] = '给生产者投票';
      actionParseInfo['detailInfo'] = payloadInfo;
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.CHANGE_PRODUCER:
      actionParseInfo['actionType'] = '改投生产者';
      actionParseInfo['detailInfo'] = payloadInfo;
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.UNVOTE_PRODUCER:
      actionParseInfo['actionType'] = '收回投票';
      actionParseInfo['detailInfo'] = payloadInfo;
      actionParseInfo['detailObj'] = {};
      break;
  }
  if (actionInfo.value > 0) {
    actionParseInfo['detailInfo'] += ",并向" + actionInfo.to + "转账" + readableNum + assetInfo.symbol;
  }  
  return actionParseInfo;
}

export {getReadableNumber, parseAction};