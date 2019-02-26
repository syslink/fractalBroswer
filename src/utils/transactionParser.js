import {decode} from 'rlp'
import BigNumber from "bignumber.js"



function getReadableNumber(value, assetDecimal) {
  var renderValue = new BigNumber(value);
  renderValue = renderValue.shiftedBy(assetDecimal * -1);
  
  BigNumber.config({ DECIMAL_PLACES: 6 });
  renderValue = renderValue.toString(10);
  return renderValue;
}

function parseAction(actionInfo, assetInfo){
  var actionParseInfo = {};
  var payloadInfo = '';
  if (actionInfo.payload.length > 2) {
    payloadInfo = decode(hex2Bytes(actionInfo.payload))
  }
  var readableNum = this.getReadableNumber(actionInfo.value, assetInfo.decimal);
  switch(actionInfo.type) {
    case actionTypes.TRANSFER:
      actionParseInfo['actionType'] = '转账';
      actionParseInfo['detailInfo'] = actionInfo.from + "向" + actionInfo.to + "转账" 
                                    + readableNum + assetInfo.symbol;
      actionParseInfo['detailObj'] = {from:actionInfo.from, to:actionInfo.to, value:readableNum, symbol:assetInfo.symbol};
      break;
    case actionTypes.CREATE_NEW_ACCOUNT:
      actionParseInfo['actionType'] = '创建账户';
      actionParseInfo['detailInfo'] = actionInfo.from + "创建账户:" + actionInfo.to;
      if (actionInfo.value > 0) {
        actionParseInfo['detailInfo'] += "并转账" + readableNum + assetInfo.symbol;
      }     
      actionParseInfo['detailObj'] = {from:actionInfo.from, to:actionInfo.to, value:readableNum, symbol:assetInfo.symbol};
      break;   
    case actionTypes.UPDATE_ACCOUNT:  
      actionParseInfo['actionType'] = '更新账户';
      actionParseInfo['detailInfo'] = payloadInfo;
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.INCREASE_ASSET:
      actionParseInfo['actionType'] = '增发资产';
      actionParseInfo['detailInfo'] = payloadInfo;
      actionParseInfo['detailObj'] = {};
      break;
    case actionTypes.ISSUE_ASSET:
      actionParseInfo['actionType'] = '发行资产';
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
  action["actionParseInfo"] = actionParseInfo;
  return action;
}

export {getReadableNumber, parseAction};