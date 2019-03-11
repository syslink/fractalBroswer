import {decode, encode} from 'rlp'
import BigNumber from "bignumber.js"

import * as actionTypes from './constant';
import { hex2Bytes, bytes2Hex, bytes2Number } from './utils';
import {getAssetInfoById} from '../api'


function getReadableNumber(value, assetDecimal) {
  var renderValue = new BigNumber(value);
  renderValue = renderValue.shiftedBy(assetDecimal * -1);
  
  BigNumber.config({ DECIMAL_PLACES: 6 });
  renderValue = renderValue.toString(10);
  return renderValue;
}

function needParsePayload(actionType) {
  return actionType != actionTypes.TRANSFER && actionType != actionTypes.CREATE_NEW_ACCOUNT;
}

function parseAction(actionInfo, assetInfo, allAssetInfos, dposInfo){
  var actionParseInfo = {...actionInfo};
  var payloadInfo = actionInfo.payload;
  if (actionInfo.payload.length > 2 && needParsePayload(actionInfo.type)) {
    console.log(actionInfo.payload);
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
      var assetId = payloadInfo[0][0];
      var amount = bytes2Number(payloadInfo[1]).toNumber();
      var addedAssetInfo = allAssetInfos[assetId];
      amount = this.getReadableNumber(amount, addedAssetInfo.decimals);
      // else {
      //   var resp = await getAssetInfoById([assetID]);
      //   assetInfo = resp.data.result;
      //   amount = this.getReadableNumber(amount, assetInfo.decimals);
      // }
      var toAccount = String.fromCharCode.apply(null, payloadInfo[2]);
      actionParseInfo['detailInfo'] = '向' + toAccount + '增发资产:资产ID=' + assetId + ',资产名称:' + addedAssetInfo.assetname + ', 增发数量=' + amount + addedAssetInfo.symbol;
      actionParseInfo['detailObj'] = {assetId: assetId, assetName: assetInfo.assetname, amount: amount, toAccount: toAccount};
      break;
    case actionTypes.ISSUE_ASSET:
      actionParseInfo['actionType'] = '发行资产';
      // var	assetId = payloadInfo[0];
      var	assetName = String.fromCharCode.apply(null, payloadInfo[1]);
      var	symbol = String.fromCharCode.apply(null, payloadInfo[2]);
      var	amount = bytes2Number(payloadInfo[3]).toNumber();
      var	decimals = payloadInfo[4][0] == undefined ? 0 : payloadInfo[4][0];
      var	founder = String.fromCharCode.apply(null, payloadInfo[5]);
      var	owner = String.fromCharCode.apply(null, payloadInfo[6]);
      // var	addIssue
      var	upperLimit = bytes2Number(payloadInfo[8]).toNumber();

      actionParseInfo['detailObj'] = {assetName:assetName, symbol:symbol, amount:amount, decimals:decimals, founder:founder, owner:owner, upperLimit:upperLimit};

      amount = this.getReadableNumber(amount, decimals);
      upperLimit = this.getReadableNumber(upperLimit, decimals);

      actionParseInfo['detailInfo'] = '资产名:' + assetName + ',符号:' + symbol + ',初始发行金额:' + amount + symbol + ',发行上限:' + upperLimit + symbol + ',精度:'
                                    + decimals + '位,创办者账号:' + founder +',管理者账号:' + owner;
      break;
    case actionTypes.DESTORY_ASSET:
      actionParseInfo['actionType'] = '销毁资产';
      // var rlpData = encode([assetId, '', '', destroyAmount, 0, '', '', 0, 0]);
      var assetId = payloadInfo[0][0];
      var destroyAmount = bytes2Number(payloadInfo[3]).toNumber();
      destroyAmount = this.getReadableNumber(destroyAmount, allAssetInfos[assetId].decimals);
      actionParseInfo['detailInfo'] = "资产ID:" + assetId + ", 销毁数量:" + destroyAmount;  
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.SET_ASSET_OWNER:
      actionParseInfo['actionType'] = '设置资产所有者';
      // var rlpData = encode([assetId, '', '', 0, 0, '', owner, 0, 0]);
      var assetId = payloadInfo[0][0];
      var	owner = String.fromCharCode.apply(null, payloadInfo[6]);
      actionParseInfo['detailInfo'] = "资产ID:" + assetId + ", 新的管理者:" + owner;  
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.SET_ASSET_FOUNDER:
      actionParseInfo['actionType'] = '设置资产创建者';
      // var rlpData = encode([assetId, '', '', 0, 0, founder, '', 0, 0]);
      var assetId = payloadInfo[0][0];
      var	founder = String.fromCharCode.apply(null, payloadInfo[5]);
      actionParseInfo['detailInfo'] = "资产ID:" + assetId + ", 新的创办者:" + founder; 
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.REG_PRODUCER:
      actionParseInfo['actionType'] = '注册生产者';
      // var rlpData = encode([this.state.url, stake]);
      var url = String.fromCharCode.apply(null, payloadInfo[0]);
      var stake = bytes2Number(payloadInfo[1]).toNumber();
      stake = this.getReadableNumber(stake, actionTypes.FT_DECIMALS);
      actionParseInfo['detailInfo'] = "URL:" + url + ", 投票数:" + stake;  
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.UPDATE_PRODUCER:
      actionParseInfo['actionType'] = '更新生产者';
       // var rlpData = encode([this.state.url, stake]);
      var url = String.fromCharCode.apply(null, payloadInfo[0]);
      var stake = bytes2Number(payloadInfo[1]).toNumber();
      stake = this.getReadableNumber(stake, actionTypes.FT_DECIMALS);
      actionParseInfo['detailInfo'] = "URL:" + url + ", 投票数:" + stake;  
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.UNREG_PRODUCER:
      actionParseInfo['actionType'] = '注销生产者';
      actionParseInfo['detailInfo'] = payloadInfo;  // 无
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.REMOVE_VOTER:
      actionParseInfo['actionType'] = '移除投票者';
      // var payload = encode([this.state.voterAccountName]);
      var removedVoter = String.fromCharCode.apply(null, payloadInfo[0]);
      actionParseInfo['detailInfo'] = "被移除的投票者:" + removedVoter;  
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.VOTE_PRODUCER:
      actionParseInfo['actionType'] = '给生产者投票';
      // var rlpData = encode([producerName, stake]);

      var producerName = String.fromCharCode.apply(null, payloadInfo[0]);
      var stake = bytes2Number(payloadInfo[1]).dividedBy(new BigNumber(dposInfo.unitStake)).toNumber();
      stake = this.getReadableNumber(stake, actionTypes.FT_DECIMALS);
      actionParseInfo['detailInfo'] = "生产者:" + producerName + ", 投票数:" + stake;  
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.CHANGE_PRODUCER:
      actionParseInfo['actionType'] = '改投生产者';
      actionParseInfo['detailInfo'] = payloadInfo;  // 
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.UNVOTE_PRODUCER:
      actionParseInfo['actionType'] = '收回投票';
      actionParseInfo['detailInfo'] = payloadInfo;  // 无
      actionParseInfo['detailObj'] = {};
      break;
  }
  if (actionInfo.value > 0 && actionInfo.type != actionTypes.TRANSFER) {
    actionParseInfo['detailInfo'] += ",并向" + actionInfo.to + "转账" + readableNum + assetInfo.symbol;
  }  
  return actionParseInfo;
}

export {getReadableNumber, parseAction};