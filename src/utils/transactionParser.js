/* eslint-disable prefer-template */
import { decode } from 'rlp';
import BigNumber from 'bignumber.js';

import * as actionTypes from './constant';
import { bytes2Hex, bytes2Number } from './utils';


function getReadableNumber(value, assetDecimal) {
  let renderValue = new BigNumber(value);
  renderValue = renderValue.shiftedBy(assetDecimal * -1);

  BigNumber.config({ DECIMAL_PLACES: 6 });
  renderValue = renderValue.toString(10);
  return renderValue;
}

function needParsePayload(actionType) {
  return actionType !== actionTypes.TRANSFER
      && actionType !== actionTypes.CREATE_CONTRACT
      && actionType !== actionTypes.CALL_CONTRACT;
}

function parseAction(actionInfo, assetInfo, allAssetInfos, dposInfo) {
  const actionParseInfo = { ...actionInfo };
  let payloadInfo = actionInfo.payload;
  if (actionInfo.payload.length > 2 && needParsePayload(actionInfo.type)) {
    console.log(actionInfo.payload);
    payloadInfo = decode(actionInfo.payload);
  }
  const readableNum = getReadableNumber(actionInfo.value, assetInfo.decimals);
  switch (actionInfo.type) {
    case actionTypes.TRANSFER:
      actionParseInfo.actionType = '转账';
      actionParseInfo.detailInfo = `${actionInfo.from}向${actionInfo.to}转账${readableNum}${assetInfo.symbol}`;
      actionParseInfo.detailObj = { from: actionInfo.from, to: actionInfo.to, value: readableNum, symbol: assetInfo.symbol };
      break;
    case actionTypes.CREATE_CONTRACT:
      actionParseInfo.actionType = '创建合约';
      actionParseInfo.detailInfo = '创建者:' + actionInfo.from;
      actionParseInfo.detailObj = { from: actionInfo.from };
      break;
    case actionTypes.CREATE_NEW_ACCOUNT:
      actionParseInfo.actionType = '创建账户';
      if (payloadInfo.length === 4) {
        const newAccount = String.fromCharCode.apply(null, payloadInfo[0]);
        const founder = String.fromCharCode.apply(null, payloadInfo[1]);
        const chargeRatio = payloadInfo[2].length === 0 ? 0 : payloadInfo[2][0];
        const publicKey = bytes2Hex(payloadInfo[3]);
        actionParseInfo.detailInfo = `新账号:${newAccount}, 创建者:${founder}, 手续费收取比例:${chargeRatio}%, 公钥:${publicKey}`;
        actionParseInfo.detailObj = { newAccount, founder, chargeRatio, publicKey };
      } else {
        actionParseInfo.detailInfo = '未知错误';
      }
      actionParseInfo.detailObj = { from: actionInfo.from, to: actionInfo.to, value: readableNum, symbol: assetInfo.symbol };
      break;
    case actionTypes.UPDATE_ACCOUNT:
      actionParseInfo.actionType = '更新账户';
      if (payloadInfo.length === 4) {
        const founder = String.fromCharCode.apply(null, payloadInfo[1]);
        const chargeRatio = payloadInfo[2].length === 0 ? 0 : payloadInfo[2][0];
        const publicKey = bytes2Hex(payloadInfo[3]);
        actionParseInfo.detailInfo = `创建者：${founder}, 手续费收取比例:${chargeRatio}%, 公钥:${publicKey}`;
        actionParseInfo.detailObj = { founder, chargeRatio, publicKey };
      } else {
        actionParseInfo.detailInfo = '未知错误';
      }
      break;
    case actionTypes.INCREASE_ASSET: {
      actionParseInfo.actionType = '增发资产';
      const assetId = payloadInfo[0][0];
      let amount = bytes2Number(payloadInfo[1]).toNumber();
      const addedAssetInfo = allAssetInfos[assetId];
      amount = getReadableNumber(amount, addedAssetInfo.decimals);
      const toAccount = String.fromCharCode.apply(null, payloadInfo[2]);
      actionParseInfo.detailInfo = `向${toAccount}增发资产:资产ID=${assetId},资产名称:${addedAssetInfo.assetname}, 增发数量=${amount}${addedAssetInfo.symbol}`;
      actionParseInfo.detailObj = { assetId, assetName: assetInfo.assetname, amount, toAccount };
      break;
    }
    case actionTypes.ISSUE_ASSET: {
      actionParseInfo.actionType = '发行资产';
      const assetName = String.fromCharCode.apply(null, payloadInfo[1]);
      const symbol = String.fromCharCode.apply(null, payloadInfo[2]);
      let amount = bytes2Number(payloadInfo[3]).toNumber();
      const decimals = payloadInfo[4][0] === undefined ? 0 : payloadInfo[4][0];
      const founder = String.fromCharCode.apply(null, payloadInfo[5]);
      const owner = String.fromCharCode.apply(null, payloadInfo[6]);
      let upperLimit = bytes2Number(payloadInfo[8]).toNumber();

      actionParseInfo.detailObj = { assetName, symbol, amount, decimals, founder, owner, upperLimit };

      amount = getReadableNumber(amount, decimals);
      upperLimit = getReadableNumber(upperLimit, decimals);

      actionParseInfo.detailInfo = `资产名:${assetName},符号:${symbol},初始发行金额:${amount}${symbol},发行上限:${upperLimit}${symbol},精度:${decimals}位,创办者账号:${founder},管理者账号:${owner}`;
      break;
    }
    case actionTypes.DESTORY_ASSET: {
      actionParseInfo.actionType = '销毁资产';
      const assetId = payloadInfo[0][0];
      let destroyAmount = bytes2Number(payloadInfo[3]).toNumber();
      destroyAmount = getReadableNumber(destroyAmount, allAssetInfos[assetId].decimals);
      actionParseInfo.detailInfo = '资产ID:' + assetId + ', 销毁数量:' + destroyAmount;
      actionParseInfo.detailObj = {};
      break;
    }
    case actionTypes.SET_ASSET_OWNER: {
      actionParseInfo.actionType = '设置资产所有者';
      const assetId = payloadInfo[0][0];
      const owner = String.fromCharCode.apply(null, payloadInfo[6]);
      actionParseInfo.detailInfo = '资产ID:' + assetId + ', 新的管理者:' + owner;
      actionParseInfo.detailObj = {};
      break;
    }
    case actionTypes.SET_ASSET_FOUNDER: {
      actionParseInfo.actionType = '设置资产创建者';
      const assetId = payloadInfo[0][0];
      const founder = String.fromCharCode.apply(null, payloadInfo[5]);
      actionParseInfo.detailInfo = '资产ID:' + assetId + ', 新的创办者:' + founder;
      actionParseInfo.detailObj = {};
      break;
    }
    case actionTypes.REG_PRODUCER: {
      actionParseInfo.actionType = '注册生产者';
      const url = String.fromCharCode.apply(null, payloadInfo[0]);
      let stake = bytes2Number(payloadInfo[1]).toNumber();
      stake = getReadableNumber(stake, actionTypes.FT_DECIMALS);
      actionParseInfo.detailInfo = 'URL:' + url + ', 投票数:' + stake;
      actionParseInfo.detailObj = {};
      break;
    }
    case actionTypes.UPDATE_PRODUCER: {
      actionParseInfo.actionType = '更新生产者';
      const url = String.fromCharCode.apply(null, payloadInfo[0]);
      let stake = bytes2Number(payloadInfo[1]).toNumber();
      stake = getReadableNumber(stake, actionTypes.FT_DECIMALS);
      actionParseInfo.detailInfo = 'URL:' + url + ', 投票数:' + stake;
      actionParseInfo.detailObj = {};
      break;
    }
    case actionTypes.UNREG_PRODUCER:
      actionParseInfo.actionType = '注销生产者';
      actionParseInfo.detailInfo = payloadInfo; // 无
      actionParseInfo.detailObj = {};
      break;
    case actionTypes.REMOVE_VOTER: {
      actionParseInfo.actionType = '移除投票者';
      // var payload = encode([this.state.voterAccountName]);
      const removedVoter = String.fromCharCode.apply(null, payloadInfo[0]);
      actionParseInfo.detailInfo = '被移除的投票者:' + removedVoter;
      actionParseInfo.detailObj = {};
      break;
    }
    case actionTypes.VOTE_PRODUCER: {
      actionParseInfo.actionType = '给生产者投票';
      const producerName = String.fromCharCode.apply(null, payloadInfo[0]);
      let stake = bytes2Number(payloadInfo[1]).dividedBy(new BigNumber(dposInfo.unitStake)).toNumber();
      stake = getReadableNumber(stake, actionTypes.FT_DECIMALS);
      actionParseInfo.detailInfo = '生产者:' + producerName + ', 投票数:' + stake;
      actionParseInfo.detailObj = {};
      break;
    }
    case actionTypes.CHANGE_PRODUCER:
      actionParseInfo.actionType = '改投生产者';
      try {
        const newProducer = String.fromCharCode.apply(null, payloadInfo[0]);
        actionParseInfo.detailInfo = `获得投票的生产者:${newProducer}`; //
      } catch (error) {
        actionParseInfo.detailInfo = '发生错误';
      }
      actionParseInfo.detailObj = {};
      break;
    case actionTypes.UNVOTE_PRODUCER:
      actionParseInfo.actionType = '收回投票';
      actionParseInfo.detailInfo = payloadInfo; // 无
      actionParseInfo.detailObj = {};
      break;
    case actionTypes.CALL_CONTRACT:
      actionParseInfo.actionType = '调用合约';
      actionParseInfo.detailInfo = payloadInfo; // 无
      actionParseInfo.detailObj = {};
      break;
    default:
      console.log('error action type:' + actionInfo.type);
  }
  if (actionInfo.value > 0 && actionInfo.type !== actionTypes.TRANSFER) {
    actionParseInfo.detailInfo += ',并向' + actionInfo.to + '转账' + readableNum + assetInfo.symbol;
  }
  return actionParseInfo;
}

export { getReadableNumber, parseAction };
