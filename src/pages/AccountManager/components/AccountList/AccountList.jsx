import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table, Button, Select, Input, Dialog, Feedback } from '@icedesign/base';
import { Tag, Balloon } from '@alifd/next';

import BigNumber from 'bignumber.js';
import * as fractal from 'fractal-web3';
import * as ethUtil from 'ethereumjs-util';
import cookie from 'react-cookies';
import { ethers } from 'ethers';

import { encode } from 'rlp';
import './AccountList.scss';

import * as txParser from '../../../../utils/transactionParser';
import { hex2Bytes } from '../../../../utils/utils';
import * as constant from '../../../../utils/constant';


const splitToken = ',';

/* 交易状态：
* 1: 发送失败：无需更新
* 2：发送成功，但尚未执行：需更新
* 3：发送成功，执行成功：需检查是否被回滚
* 4：发送成功，执行失败：需检查是否被回滚
* 5：内部交易成功：需检查是否被回滚
* 6：内部交易失败：需检查是否被回滚
*/
const TxStatus = { SendError:1, NotExecute:2, ExecuteSuccess:3, ExecuteFail:4, InnerSuccess:5, InnerFail:6 };

/* 区块状态：
    * 1: 可逆：   1   //初始默认的状态值
    * 2：不可逆   0
    * 3：被回滚  -1
*/
const BlockStatus = { Rollbacked: -1, Irreversible: 0, Reversible: 1 };

export default class AccountList extends Component {
  static displayName = 'AccountList';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      creator: '',
      fractalAccount: '',
      selfAccount: '',
      accountReg: new RegExp('^[a-z0-9]{7,16}(\\.[a-z0-9]{1,8}){0,1}$'),
      numberReg: new RegExp('^[1-9]+(\\.[0-9]*){0,1}$'),
      gasReg: new RegExp('^[1-9][0-9]*'),
      fractalPublicKey: '',
      selfPublicKey: '',
      otherPublicKey: '',
      email: '',
      emailReg: new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$'),
      password: '',
      balanceInfos: [],
      assetInfos: {},
      importAccountName: '',
      assetVisible: false,
      curBalance: {},
      curTransferAsset: {},
      curAccount: '',
      curAccountFTBalance: '',
      transferToAccount: '',
      transferValue: 0,
      transferAssetSymbol: '',
      suggestionPrice: 10,
      gasPrice: 0,
      gasLimit: 0,
      txVisible: false,
      txInfos: [],
      inputOtherPK: false,
      inputOtherPKStr: '输入其它公钥',
      dposInfo: {},
      irreversibleInfo: {},
      maxRollbackBlockNum: 0,
      maxRollbackTime: 0,  // ms
      importAccountVisible: false,
      authorListVisible: false,
      selfCreateAccountVisible: false,
      bindNewAuthorVisible: false,
      updateWeightVisible: false,
      accountInfos: [],
      authorList: [],
      accountNames: [],
      keystoreList: [],
      blockRollbackCache: {},
      curBlock: null,
      syncTxInterval: 60000,
    };
  }

  componentDidMount = async () => {
    this.state.dposInfo = await fractal.dpos.getDposInfo();
    this.state.maxRollbackBlockNum = this.state.dposInfo.blockFrequency * this.state.dposInfo.cadidateScheduleSize * this.state.dposInfo.delayEcho;
    this.state.maxRollbackTime = this.state.maxRollbackBlockNum * this.state.dposInfo.blockInterval;
    this.state.irreversibleInfo = await fractal.dpos.getDposIrreversibleInfo();
    this.loadAccountsFromLS();
    this.loadKeystoreFromLS();
    this.syncTxFromNode();
  }
  loadKeystoreFromLS = () => {
    const keystoreInfoStr = global.localStorage.getItem(constant.KeyStoreFile);
    if (keystoreInfoStr != null) {
      const keystoreInfoObj = JSON.parse(keystoreInfoStr);
      this.state.keystoreList = keystoreInfoObj.keyList;
    }
  }
  loadAccountsFromLS = async () => {
    const accountsStr = global.localStorage.getItem(constant.AccountFile);
    if (accountsStr != null) {
      const accounts = accountsStr.split(splitToken);
      for (const account of accounts) {
        const accountObj = await fractal.account.getAccountByName(account);
        if (accountObj != null) {
          this.state.accountInfos.push(accountObj);
        } 
      }

      this.setState({accountInfos: this.state.accountInfos});
    }
  }
  // 返回true表示区块被回滚
  checkBlockRollback = async (blockHash, blockNum) => {
    const blockInfo = fractal.ft.getBlockByNum(blockNum);
    return blockInfo.hash !== blockHash;
  }
  saveAccountsToLS = () => {
    let accounts = '';
    this.state.accountInfos.map(item => accounts += item.accountName + splitToken);
    if (accounts.length > 0) {
      accounts = accounts.substr(0, accounts.length - 1);
    }
    global.localStorage.setItem(constant.AccountFile, accounts);
  }

  onImportAccount = () => {
    this.setState({ importAccountVisible: true });
  }

  onImportAccountOK = async () => {
    if (this.state.importAccountName == '') {
      Feedback.toast.error('请输入账号');
      return;
    }
    if (!this.state.accountReg.test(this.state.importAccountName)) {
      Feedback.toast.error('账号格式错误');
      return;
    }
    try {
      const self = this;
      fractal.account.getAccountByName(this.state.importAccountName).then(account => {
        if (account != null) {
          const accountInfos = [...self.state.accountInfos, account];
          self.setState({ accountInfos });
          self.saveAccountsToLS();
        } else {
          Feedback.toast.error('账户不存在');
        }
      });
    } catch (error) {
      Feedback.toast.error(error);
    }
  };

  onImportAccountClose = () => {
    this.setState({ importAccountVisible: false });
  }

  deleteItem = (index) => {
    this.state.accountInfos.splice(index, 1);
    this.setState({accountInfos: this.state.accountInfos});
    this.saveAccountsToLS();
  };

  showAssets = (index) => {
    this.state.curAccount = this.state.accountInfos[index];
    const balances = this.state.accountInfos[index].balances;
    const self = this;
    let promiseArr = [];
    for (const balance of balances) {
      if (this.state.assetInfos[balance.assetID] === undefined) {
        promiseArr.push(fractal.account.getAssetInfoById(balance.assetID));
      }
      if (balance.assetID === 1) {
        this.state.curAccountFTBalance = balance.balance;
      }
    }
    if (promiseArr.length > 0) {
      Promise.all(promiseArr).then(assets => {
        for (const asset of assets) {
          self.state.assetInfos[asset.assetId] = asset;
        }
        self.setState({
          assetVisible: true,
          balanceInfos: balances,
        });
      })
    } else {
      this.setState({
        assetVisible: true,
        balanceInfos: balances,
      });
    }
  }
  /** 
    * 交易状态：
    * 1: 发送失败：无需更新
    * 2：发送成功，但尚未执行：需更新
    * 3：发送成功，执行成功：需检查是否被回滚
    * 4：发送成功，执行失败：需检查是否被回滚
    * 5：内部交易成功：需检查是否被回滚
    * 6：内部交易失败：需检查是否被回滚
    *
    *  区块状态：
    * 1: 可逆：显示离不可逆的距离
    * 2：不可逆
    * 
   * 需要保存在文件中的账户信息及信息同步时间点：
   * （1）如果是首次同步账户交易信息，则从账户创建时的区块开始同步，同步到最新区块后，在文件中记录此账户最近同步的区块高度
   * （2）如果不是首次同步账户交易信息，则从文件中记录的区块高度+1开始同步交易
   * （3）即便账户被删除，交易信息依然需要保留下来
   * （4）用户在创建或导入账户的时候，就要开始定时同步此账户的交易信息
   * （5）网站刚打开，从文件中导入账户的时候，也需要开始同步账户的交易信息
   * 
   * 需要保存在文件中的交易信息：
   * 交易发起时间：
   * 交易hash:
   * 区块hash:
   * 区块状态：三种状态，可逆，不可逆，回退，只有当不可逆的时候，不需要再向节点获取状态，否则需要向节点轮询区块状态
   * 类型
   * 详情
   * 结果：需要查询receipt
   * 总gas费
   * gas分配详情
   * 
   * {account1:{lastBlockHash, lastBlockNum, txInfos:[{isInnerTx,txStatus,date,txHash,blockHash,blockNum,blockStatus, actions:[ {type,from,to,assetID,value,payload,status,actionIndex,gasUsed,gasAllot: [ account,gas,typeId],error}],{...}]}}
   * 
   * 交易保存到三个文件中：
   * 1. txSentFail: 发送时就返回失败的交易
   * 2. txSentSuccess: 发送成功的交易
   * 3. txExecuted: 已执行的交易，保存成功和失败以及被回滚的
  */
  showTxs = async (index) => {
    try {
      this.state.curAccount = this.state.accountInfos[index];
      for (const balance of this.state.accountInfos[index].balances) {
        if (this.state.assetInfos[balance.assetID] == null) {
          const assetInfo = await fractal.account.getAssetInfoById(balance.assetID);
          this.state.assetInfos[balance.assetID] = assetInfo;
        }
      }

      let allTxInfoSet = global.localStorage.getItem(constant.TxInfoFile);
      if (allTxInfoSet != null) {
        allTxInfoSet = JSON.parse(allTxInfoSet);
        const accountTxInfoSet = allTxInfoSet[this.state.curAccount.accountName];
        const txInfos = [];
        for (const txInfo of accountTxInfoSet.txInfos) {
          const parsedActions = [];
          let transaction = txInfo;
          
          for (const actionInfo of txInfo.actions) {
            if (this.state.assetInfos[actionInfo.assetID] === undefined) {
              const asset = await fractal.account.getAssetInfoById(actionInfo.assetID);
              this.state.assetInfos[actionInfo.assetID] = asset;
            }
            const parsedAction = txParser.parseAction(actionInfo, this.state.assetInfos[actionInfo.assetID], this.state.assetInfos, this.state.dposInfo);
            if (txInfo.txStatus != TxStatus.SendError && txInfo.txStatus != TxStatus.NotExecute) {
              parsedAction.result = actionInfo.status == 1 ? '成功' : `失败（${actionInfo.error}）`;
              parsedAction.gasFee = `${actionInfo.gasUsed} aft`;
              parsedAction.gasAllot = actionInfo.gasAllot;
            } else {
              parsedAction.result = '';
              parsedAction.gasFee = '';
              parsedAction.gasAllot = '';
            }
            parsedActions.push(parsedAction);
          }
          
          transaction.actions = parsedActions;
          transaction.date = txInfo.date;
          txInfos.push(transaction);
        }
        this.setState({
          txVisible: true,
          txInfos,
        });
      } else {
        this.setState({
          txVisible: true,
          txInfos: [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  /**
    *   1.1 如果交易是可逆的，则检查其是否已被回滚
    *     1.1.1 如果没有被回滚，则确认其是否不可逆，是的话，更新状态irreversible为不可逆
    *     1.1.2 如果被回滚，则更新状态blockStatus
    *   1.2 如果不可逆，则pass
   *  */
  updateTxStatus = async (txInfo, lastIrreveribleBlockNum, callback) => {
    if (Object.prototype.hasOwnProperty.call(txInfo, 'blockHash')) {   // 通过blockHash判断交易receipt是否已经获取过，条件成立则同步区块状态，否则获取交易的receipt
      if (txInfo.blockStatus == null || txInfo.blockStatus === BlockStatus.Reversible) {
        if (this.state.blockRollbackCache[txInfo.blockHash] == null) {
          const blockInfo = await fractal.ft.getBlockByNum(txInfo.blockNumber);
          this.state.blockRollbackCache[txInfo.blockHash] = blockInfo.hash != txInfo.blockHash;
        }
        if (this.state.blockRollbackCache[txInfo.blockHash]) {
          txInfo.blockStatus = BlockStatus.Rollbacked;
        } else {
          txInfo.blockStatus = txInfo.blockNumber <= lastIrreveribleBlockNum ? BlockStatus.Irreversible : BlockStatus.Reversible; 
        }
        callback(txInfo);
      }
    } else {
      const receipt = await fractal.ft.getTransactionReceipt(txInfo.txHash);
      if (receipt != null) {   // 被回滚的区块所包含的交易是没有receipt的
        txInfo.actions[0].blockHash = receipt.actionResults[0].blockHash;
        txInfo.actions[0].blockNum = receipt.actionResults[0].blockNum;
        txInfo.actions[0].status = receipt.actionResults[0].status;
        txInfo.txStatus = receipt.actionResults[0].status == 1 ? TxStatus.ExecuteSuccess : TxStatus.ExecuteFail;
        txInfo.actions[0].gasUsed = receipt.actionResults[0].gasUsed;
        txInfo.actions[0].gasAllot = receipt.actionResults[0].gasAllot;
        txInfo.actions[0].error = receipt.actionResults[0].error;
      }
      callback(txInfo);
    }
  }
  /** 
    * {account1:{lastBlockHash, lastBlockNum, txInfos:[{isInnerTx,txStatus,date,txHash,blockHash,blockNum,blockStatus, actions:[ {type,from,to,assetID,value,payload,status,actionIndex,gasUsed,gasAllot: [ account,gas,typeId],error}],{...}]}}
    * 
    * 交易状态：
    * 1: 发送失败：无需更新
    * 2：发送成功，但尚未执行：需更新
    * 3：发送成功，执行成功：需检查是否被回滚
    * 4：发送成功，执行失败：需检查是否被回滚
    * 5：内部交易成功：需检查是否被回滚
    * 6：内部交易失败：需检查是否被回滚
    *
    *
    * 区块状态：
    * 1: 可逆：   1   //初始默认的状态值
    * 2：不可逆   0
    * 3：被回滚  -1
    * 
    * 同步交易的过程：
    * 1：先遍历所有已存在的交易状态
    * 2：同步新的交易，为了防止区块已经被回退，需要往前同步一些区块，譬如两轮的区块数
    * 
    * 问：如何确认区块尚未被回滚？
    * 答：通过高度获取区块，然后比较区块的hash，如果一致，则表示当前未被回滚，当然，不能排除后面被回滚的可能性
    * 
    * 问：如何确认区块状态不可逆？
    * 答：首先确认区块未被回滚，这样区块高度才是有效的，然后才能根据区块高度来确认区块不可逆。
  */
  syncTxFromNode = async () => {
    try {
      let startSyncBlockNum = 0;
      let allTxInfoSet = global.localStorage.getItem(constant.TxInfoFile);
      if (allTxInfoSet == null) {
        allTxInfoSet = {};
      } else {
        allTxInfoSet = JSON.parse(allTxInfoSet);
      }

      const self = this;
      fractal.ft.getCurrentBlock(false).then(async (curBlock) => {
        self.state.curBlock = curBlock;
        const curBlockNum = self.state.curBlock.number;
        const lastIrreveribleBlockNum = self.state.irreversibleInfo.proposedIrreversible;
        self.state.blockRollbackCache = {};
        // 遍历所有本地账户，从文件中获取其已有交易信息，跟链进行状态同步，并将链上新的交易写入文件
        for (const account of self.state.accountInfos) {
          const accountName = account.accountName;
          let accountExistTxs = {};
          if (allTxInfoSet[accountName] != null) {                             // 在交易文件中存在某个账户的记录
            //lastSyncBlockNum = allTxInfoSet[accountName].lastBlockNum;
            //lastSyncBlockHash = allTxInfoSet[accountName].lastBlockHash;
            startSyncBlockNum = allTxInfoSet[accountName].lastBlockNum + 1;     // 前一次同步到的最后一个区块高度
            for (const txInfo of allTxInfoSet[accountName].txInfos) {           // 本地提取所有未发送失败的交易，并且同步其状态
              if (txInfo.txStatus !== TxStatus.SendError) {                     // 同步所有非发送失败的交易的状态
                await self.updateTxStatus(txInfo, lastIrreveribleBlockNum, (updatedTxInfo) => {                  
                  accountExistTxs[updatedTxInfo.txHash] = updatedTxInfo; 
                });                      
              } else {
                accountExistTxs[txInfo.txHash] = txInfo; 
              }
            }
          } else {  // 无此账户的历史交易数据，需要从账户创建之区块开始同步其交易
            startSyncBlockNum = account.number;
            allTxInfoSet[accountName] = {};
          }
          startSyncBlockNum -= self.state.maxRollbackBlockNum;
          if (startSyncBlockNum < 0) {
            startSyncBlockNum = 0;
          }

          let promiseArr = [];
          let accountTxs = [];
          const step = self.state.maxRollbackBlockNum * 10;
          let blockNum = curBlockNum;
          for (; blockNum > startSyncBlockNum; blockNum -= step) {
            let lookBack = step;
            if (blockNum - startSyncBlockNum < step) {
              lookBack = blockNum - startSyncBlockNum;
            }
            promiseArr.push(fractal.ft.getTxsByAccount(accountName, blockNum, lookBack));
            // TODO 内部交易
            //accountTxs.push(fractal.ft.getInternalTxsByAccount(accountName, blockNum, lookBack));
          }

          allTxInfoSet[accountName].lastBlockNum = curBlockNum;
          allTxInfoSet[accountName].lastBlockHash = self.state.curBlock.hash;
          allTxInfoSet[accountName].txInfos = [];

          Promise.all(promiseArr).then(allTxs => {   // 获取所有交易的hash
            for (const txs of allTxs) {
              accountTxs.push(...txs);
            }
            promiseArr = [];
            let blockCache = {};
            for (const txHash of accountTxs) {
              if (accountExistTxs[txHash] == null) {
                promiseArr.push(fractal.ft.getTransactionByHash(txHash));                             
              }
            }
            Promise.all(promiseArr).then(async (txInfos) => {   // 获取所有交易详情
              promiseArr = [];
              for (let txInfo of txInfos) {
                if (blockCache[txInfo.blockHash] == null) {
                  promiseArr.push(fractal.ft.getBlockByHash(txInfo.blockHash));
                }
              }
              if (promiseArr.length > 0) {
                Promise.all(promiseArr).then(async (blocks) => {  // 获取所有未获取过的交易相关的区块，用于更新交易打包时间，之后再更新所有交易
                  for (const block of blocks) {
                    blockCache[block.hash] = block;
                  }
                  for (let txInfo of txInfos) {
                    txInfo.date = blockCache[txInfo.blockHash].timestamp;
                    await self.updateTxStatus(txInfo, lastIrreveribleBlockNum, (updatedTxInfo) => {                  
                      accountExistTxs[updatedTxInfo.txHash] = updatedTxInfo; 
                    });
                  }
                  allTxInfoSet[accountName].txInfos.push(...Object.values(accountExistTxs));
                  if (!this.hasUnExecutedTx(allTxInfoSet)) {
                    this.state.syncTxInterval = 60000;
                  }
                  global.localStorage.setItem(constant.TxInfoFile, JSON.stringify(allTxInfoSet));
                });
              } else {  
                for (let txInfo of txInfos) {
                  txInfo.date = blockCache[txInfo.blockHash].timestamp;
                  await self.updateTxStatus(txInfo, lastIrreveribleBlockNum, (updatedTxInfo) => {                  
                    accountExistTxs[updatedTxInfo.txHash] = updatedTxInfo; 
                  });
                }
                allTxInfoSet[accountName].txInfos.push(...Object.values(accountExistTxs));
                if (!this.hasUnExecutedTx(allTxInfoSet)) {
                  this.state.syncTxInterval = 60000;
                }
                global.localStorage.setItem(constant.TxInfoFile, JSON.stringify(allTxInfoSet));
              }
            });
          })
        }
      })
    } catch (error) {
      if (error.message) {
        Feedback.toast.error(error.message);
      }
    }
    setTimeout(() => { this.syncTxFromNode(); }, this.state.syncTxInterval);
  }

  hasUnExecutedTx = (allTxInfoSet) => {
    for (const accountInfo of Object.values(allTxInfoSet)) {
      for (const tx of accountInfo.txInfos) {
        if (tx.txStatus === TxStatus.NotExecute) {
          return true;
        }
      }
    }
    return false;
  }
  renderActionType = (value, index, record) => {
    const parseActions = record.actions;
    return parseActions.map((item) => {
      const defaultTrigger = <Tag type="normal" size="small">{item.actionType}</Tag>;
      return <Balloon trigger={defaultTrigger} closable={false}>{item.actionType}</Balloon>;
    });
  }
  renderDate = (value) => {

  }
  renderTxStatus = (value, index, record) => {
    let status = '';
    switch(value) {
      case TxStatus.SendError:
        status = '发送失败';
        break;
      case TxStatus.NotExecute:
        status = '尚未执行';
        break;
      case TxStatus.ExecuteFail:
      case TxStatus.InnerFail:
        status = '执行失败';
        break;
      case TxStatus.ExecuteSuccess:
      case TxStatus.InnerSuccess:
        status = '执行成功';
        break;        
    }
    return status;
  }

  renderBlockStatus = (value, index, record) => {
    let status = '';
    switch(value) {
      case BlockStatus.Rollbacked:
        status = '已回滚';
        break;
      case BlockStatus.Irreversible:
        status = '不可逆';
        break;
      case BlockStatus.Reversible:
        status = '可逆';
        break;     
    }
    return status;
  }

  renderDetailInfo = (value, index, record) => {
    const parseActions = record.actions;
    return parseActions.map((item) => {
      const defaultTrigger = <Tag type="normal" size="small">{item.detailInfo}</Tag>;
      return <Balloon trigger={defaultTrigger} closable={false}>{item.detailInfo}</Balloon>;
    });
  }

  renderResult = (value, index, record) => {
    const parseActions = record.actions;

    return parseActions.map((item) => {
      console.log(item.result);
      const defaultTrigger = <Tag type="normal" size="small">{item.result}</Tag>;
      return <Balloon trigger={defaultTrigger} closable={false}>{item.result}</Balloon>;
    });
  }

  renderGasFee = (value, index, record) => {
    const parseActions = record.actions;
    return parseActions.map((item) => {
      const defaultTrigger = <Tag type="normal" size="small">{item.gasFee}</Tag>;
      return <Balloon trigger={defaultTrigger} closable={false}>{item.gasFee}</Balloon>;
    });
  }

  renderGasAllot = (value, index, record) => {
    const parseActions = record.actions;
    return parseActions[0].gasAllot.map((gasAllot) => {
      const defaultTrigger = <Tag type="normal" size="small">{gasAllot.account}=》{gasAllot.gas}aft</Tag>;
      return <Balloon trigger={defaultTrigger} closable={false}>{gasAllot.account}=》{gasAllot.gas}aft</Balloon>;
    });
  }
  showKeys = async (index) => {
    this.setState({authorListVisible: true, authorList: this.state.accountInfos[index].authors});
  }
  bindNewKey = async (index) => {
    this.setState({ bindNewAuthorVisible: true });
  }
  renderOperation = (value, index) => {
    return (
      <view>
        <Button type="primary" onClick={this.deleteItem.bind(this, index)}>
          删除
        </Button>
        &nbsp;&nbsp;
        <Button type="primary" onClick={this.showAssets.bind(this, index)}>
          查看资产/转账
        </Button>
        &nbsp;&nbsp;
        <Button type="primary" onClick={this.showTxs.bind(this, index)}>
          查看交易
        </Button>
        <p /><p />
        <Button type="primary" onClick={this.showKeys.bind(this, index)}>
          查看绑定的密钥
        </Button>
        &nbsp;&nbsp;
        <Button type="primary" onClick={this.bindNewKey.bind(this, index)}>
          绑定新密钥
        </Button>
      </view>
    );
  };

  deleteAuthor = async (index) => {

  }
  updateWeight = async (index) => {

  }
  renderAuthorOperation = (value, index) => {
    return (
      <view>
        <Button type="primary" onClick={this.deleteAuthor.bind(this, index)}>
          删除
        </Button>
        &nbsp;&nbsp;
        <Button type="primary" onClick={this.updateWeight.bind(this, index)}>
          修改权重
        </Button>
      </view>
    );
  };
  onAuthorListClose = () => {
    this.setState({authorListVisible: false});
  }

  onSystemCreatAccountOK = () => {
    if (!this.state.accountReg.test(this.state.fractalAccount)) {
      Feedback.toast.error('账号格式错误');
      return;
    }
    if (this.state.fractalPublicKey == '') {
      Feedback.toast.error('请选择公钥');
      return;
    }
    if (!this.state.emailReg.test(this.state.email)) {
      Feedback.toast.error('邮箱格式错误');
      return;
    }
    // this.props.createAccountBySystem({ accountName: this.state.fractalAccount, publicKey: this.state.fractalPublicKey, email: this.state.email });
  };
  onSystemCreatAccountClose = () => {
    this.setState({systemHelpVisible: false});
  }

  addAccountBySelf = () => {
    this.state.accountNames = [];
    this.state.accountInfos.map(account => this.state.accountNames.push(account.accountName));
    this.setState({ selfCreateAccountVisible: true });
  }
  onSelfCreateAccountOK = () => {
    if (this.state.creator == '') {
      Feedback.toast.error('请选择创建者账号');
      return;
    }
    if (!this.state.accountReg.test(this.state.selfAccount)) {
      Feedback.toast.error('账号格式错误');
      return;
    }
    if (this.state.selfPublicKey == '' && this.state.otherPublicKey == '') {
      Feedback.toast.error('请选择或输入公钥');
      return;
    }
    if (this.state.password == '') {
      Feedback.toast.error('请输入密码');
      return;
    }
    let publicKey = this.state.otherPublicKey;
    if (publicKey == '') {
      publicKey = this.state.selfPublicKey;
    }
    const rlpData = encode([this.state.selfAccount, this.state.creator, 0, this.state.selfPublicKey]);

    const params = { accountName: this.state.creator,
      data: `0x${rlpData.toString('hex')}`,
      actionType: constant.CREATE_NEW_ACCOUNT,
      toAccountName: this.state.dposInfo.systemName,
      password: this.state.password,
    };
    //this.props.createAccountBySelf(params);
  };

  onSelfCreateAccountClose = () => {
    this.setState({ selfCreateAccountVisible: false });
  }
  onChangeCreatorAccount(value) {
    this.state.creator = value;
  }
  handlePasswordChange(v) {
    this.state.password = v;
  }
  handleNewAccountNameChange(v) {
    this.state.newAccountName = v;
  }
  handleNewOwnerChange(v) {
    this.state.newOwner = v;
  }
  handleWeightChange(v) {
    this.state.weight = v;
  }
  handleSelfPublicKeyChange(v) {
    this.state.selfPublicKey = v;
    if (v == this.state.inputOtherPKStr) {
      this.setState({ inputOtherPK: true });
    } else {
      this.setState({ inputOtherPK: false, otherPublicKey: '' });
    }
  }
  handleOthersPublicKeyChange(v) {
    this.state.otherPublicKey = v;
  }

  handleImportAccountChange(v) {
    this.state.importAccountName = v;
  }

  handleTransferToAccountChange(v) {
    this.state.transferToAccount = v;
  }
  handleTransferValueChange(v) {
    this.state.transferValue = v;
  }
  handleGasPriceChange(v) {
    this.state.gasPrice = v;
  }
  handleGasLimitChange(v) {
    this.state.gasLimit = v;
  }

  onBindNewAuthorOK = () => {
    if (this.state.selfPublicKey == '' && this.state.otherPublicKey == '') {
      Feedback.toast.error('请选择或输入公钥');
      return;
    }
    if (this.state.password == '') {
      Feedback.toast.error('请输入密码');
      return;
    }
    let publicKey = this.state.otherPublicKey;
    if (publicKey == '') {
      publicKey = this.state.selfPublicKey;
    }

    let founder = this.state.curAccount.founder;
    if (founder == '') {
      founder = this.state.curAccount.accountName;
    }

    const rlpData = encode(['', founder, this.state.curAccount.chargeRatio, publicKey]);
    const params = {
      accountName: this.state.curAccount.accountName,
      actionType: constant.UPDATE_ACCOUNT,
      data: `0x${rlpData.toString('hex')}`,
      password: this.state.password,
    };

    //this.props.updatePK(params);
  }
  onBindNewAuthorClose = () => {
    this.setState({ bindNewAuthorVisible: false });
  }

  onUpdateWeightOK = () => {

  }

  onUpdateWeightClose = () => {
    this.setState({ updateWeightVisible: false });
  }


  onAssetClose = () => {
    this.setState({
      assetVisible: false,
    });
  };
  symbolRender = (value) => {
    let assetInfo = this.state.assetInfos[value];
    if (assetInfo != null) {
      return assetInfo.symbol;
    }
    const self = this;
    fractal.account.getAssetInfoById(value).then(assetInfo => {
      self.state.assetInfos[value] = assetInfo;
    });
    
    return '';
  }
  balanceRender = (value, index) => {
    const { assetInfos, balanceInfos } = this.state;
    const decimals = assetInfos[balanceInfos[index].assetID].decimals;
    // var baseValue = new BigNumber(10).pow(decimals);

    let renderValue = new BigNumber(value);
    renderValue = renderValue.shiftedBy(decimals * -1);

    BigNumber.config({ DECIMAL_PLACES: 6 });
    renderValue = renderValue.toString(10);
    return renderValue;
  }
  assetRender = (value, index) => {
    return (
      <view>
        <Button type="primary" onClick={this.transfer.bind(this, index)}>
          转账
        </Button>
      </view>
    );
  };
  renderContract = (value, index) => {
    return value > 0 ? '是' : '否';
  }

  transfer = (index) => {
    const assetID = this.state.balanceInfos[index].assetID;
    const self = this;
    fractal.ft.getSuggestionGasPrice().then(gasPrice => {
      if (gasPrice > self.state.suggestionPrice) {
        self.state.suggestionPrice = gasPrice;
      }
  
      self.setState({
        transferVisible: true,
        transferAssetSymbol: self.state.assetInfos[assetID].symbol,
        curTransferAsset: self.state.assetInfos[assetID],
        curBalance: self.state.balanceInfos[index],
      });
    });
  }
  onTransferOK = () => {
    if (this.state.transferToAccount == '') {
      Feedback.toast.error('请输入账号');
      return;
    }
    if (!this.state.accountReg.test(this.state.transferToAccount)) {
      Feedback.toast.error('账号格式错误');
      return;
    }
    const self = this;
    fractal.account.isAccountExist(this.state.transferToAccount).then(exist => {
      if (!exist) {
        Feedback.toast.error('目标账号不存在');
        return;
      }
  
      if (self.state.transferValue == '') {
        Feedback.toast.error('请输入转账金额');
        return;
      }
      if (!self.state.numberReg.test(self.state.transferValue)) {
        Feedback.toast.error('请输入正确的金额');
        return;
      }
  
      if (self.state.gasPrice == '') {
        Feedback.toast.error('请输入GAS单价');
        return;
      }
      if (!self.state.gasReg.test(self.state.gasPrice)) {
        Feedback.toast.error('请输入正确GAS单价');
        return;
      }
  
      if (self.state.gasLimit == '') {
        Feedback.toast.error('请输入愿意支付的最多GAS数量');
        return;
      }
      if (!self.state.gasReg.test(self.state.gasLimit)) {
        Feedback.toast.error('请输入正确的GAS上限');
        return;
      }
  
      if (self.state.password == '') {
        Feedback.toast.error('请输入密码');
        return;
      }
  
      const decimals = self.state.curTransferAsset.decimals;
      const value = new BigNumber(self.state.transferValue).shiftedBy(decimals);
  
      const gasValue = new BigNumber(self.state.gasPrice).multipliedBy(self.state.gasLimit).shiftedBy(9);
      const maxValue = new BigNumber(self.state.curBalance.balance);
      if (self.state.curTransferAsset.assetId === 1) {
        const valueAddGasFee = value.plus(gasValue);
  
        if (valueAddGasFee.comparedTo(maxValue) > 0) {
          Feedback.toast.error('余额不足');
          return;
        }
      } else {
        if (value.comparedTo(maxValue) > 0) {
          Feedback.toast.error('余额不足');
          return;
        }
        const ftValue = new BigNumber(self.state.curAccountFTBalance);
        if (gasValue.comparedTo(ftValue) > 0) {
          Feedback.toast.error('FT余额不足，可能无法支付足够GAS费');
          return;
        }
      }
  
      const transferInfo = { actionType: constant.TRANSFER,
        accountName: self.state.curAccount.accountName,
        toAccountName: self.state.transferToAccount,
        assetId: self.state.curTransferAsset.assetId,
        gasLimit: new BigNumber(self.state.gasLimit).toNumber(),
        gasPrice: new BigNumber(self.state.gasPrice).toNumber(),
        value: value.toNumber(),
        payload: '' };
  
      const authors = self.state.curAccount.authors;
      const threshold = self.state.curAccount.threshold;
      const keystores = self.getValidKeystores(authors, threshold);
      if (keystores.length == 0) {
        Feedback.toast.error('本地不满足交易签名要求！');
      } else {
        let index = 0;
        let multiSigInfos = [];
        let promiseArr = [];
        for (const ethersKSInfo of keystores) {
          promiseArr.push(ethers.Wallet.fromEncryptedJson(JSON.stringify(ethersKSInfo), this.state.password));
        }
        Promise.all(promiseArr).then(wallets => {
          for (const wallet of wallets) {
            multiSigInfos.push({privateKey: wallet.privateKey, indexes: [index]});
            index++;
          }
          /* 
            txInfo = {actionType, accountName, gasPrice, gasLimit, assetId, toAccountName, value, payload}
            multiSigInfos = [{privateKey, indexes}]
            */
          let chainId = 1;
          const chainIdCookie = cookie.load('chainId');
          if (chainIdCookie != null && chainIdCookie != '') {
            chainId = chainIdCookie;
          }

          fractal.ft.sendMultiSigTransaction(chainId, transferInfo, multiSigInfos).then(txHash => {
            if (txHash != null) {
              Feedback.toast.success('交易发送成功');
              self.setState({syncTxInterval: 3000, transferVisible: false});
            } else {
              Feedback.toast.error('交易发送失败');
            }
    
          }).catch(error => {
            console.log(error);
            Feedback.toast.error('交易发送失败：' + error);
          });
        }).catch(error => {
          console.log(error);
          Feedback.toast.error(error.message);
        });
        
        Feedback.toast.success('开始发送交易');
      }
    })
    
  };
  getValidKeystores = (authors, threshold) => {
    let keystoreInfo = {};
    for (const keystore of this.state.keystoreList) {
      keystoreInfo[keystore.address] = keystore;
    }

    let totalWeight = 0;
    let myKeystores = [];
    for (const author of authors) {
      const owner = author.Owner;
      const buffer = Buffer.from(hex2Bytes(owner));
      let address = '0x';
      if (ethUtil.isValidPublic(buffer, true)) {
        address = ethUtil.bufferToHex(ethUtil.pubToAddress(owner, true));
      } else if (ethUtil.isValidAddress(buffer)) {
        address = ethUtil.bufferToHex(buffer);
      }
      if (address.startsWith('0x')) {
        address = address.substr(2);
      }
      if (keystoreInfo[address] != null) {
        totalWeight += author.weight;
        myKeystores.push(keystoreInfo[address]);
        if (totalWeight >= threshold) {
          break;
        }
      }
    }
    return totalWeight < threshold ? [] : myKeystores;
  }
  onTransferClose = () => {
    this.setState({
      transferVisible: false,
    });
  }

  onTxClose = () => {
    this.setState({
      txVisible: false,
    });
  };
  render() {
    return (
      <div className="editable-table">
        <IceContainer>
          <Table primaryKey="accountName" dataSource={this.state.accountInfos} hasBorder={false} isLoading={this.state.isLoading}>
            <Table.Column
              width={110}
              title="账号"
              dataIndex="accountName"
            />
            <Table.Column
              width={110}
              title="创建者"
              dataIndex="founder"
            />
            <Table.Column
              width={100}
              title="权限阈值"
              dataIndex="threshold"
            />
            <Table.Column
              width={100}
              title="注册区块"
              dataIndex="number"
            />
            <Table.Column
              width={120}
              title="是否合约账户"
              dataIndex="codeSize"
              cell={this.renderContract.bind(this)}
            />
            <Table.Column
              width={80}
              title="手续费比例"
              dataIndex="chargeRatio"
            />
            <Table.Column title="操作" width={400} cell={this.renderOperation} />
          </Table>
          {/* <div onClick={this.addAccountBySystem.bind(this)} style={styles.addNewItem}>
            + 新增账户(第三方免费帮您创建)
          </div> */}
          <div onClick={this.addAccountBySelf.bind(this)} style={styles.addNewItem}>
            + 新增账户
          </div>
          <div onClick={this.onImportAccount.bind(this)} style={styles.addNewItem}>
            + 导入账户
          </div>
        </IceContainer>
        {/* <Dialog
          visible={this.props.systemHelpVisible}
          onOk={this.onSystemCreatAccountOK.bind(this)}
          onCancel={() => this.onSystemCreatAccountClose.bind(this)}
          onClose={() => this.onSystemCreatAccountClose.bind(this)}
          title="账户创建"
          footerAlign="center"
        >
          <Input hasClear
            onChange={this.handleFractalAccountNameChange.bind(this)}
            style={{ width: 400 }}
            addonBefore="待创建账号"
            size="medium"
            defaultValue=""
            maxLength={16}
            hasLimitHint
            placeholder="由a-z0-9组成，长度8~16位"
          />
          <br />
          <br />
          <Select
            style={{ width: 400 }}
            placeholder="选择公钥，此公钥将同账户绑定，账户所有者有权更换"
            onChange={this.handleFractalPublicKeyChange.bind(this)}
            label="公钥："
          >
            {
            this.props.keystoreList.map((keystore) => (
              <Select.Option value={keystore.publicKey} lable={keystore.publicKey}>
                {keystore.publicKey}
              </Select.Option>
            ))
          }
          </Select>
          <br />
          <br />
          <Input hasClear
            onChange={this.handleEmailChange.bind(this)}
            style={{ width: 400 }}
            addonBefore="邮箱"
            size="medium"
            defaultValue=""
            maxLength={34}
            hasLimitHint
          />
        </Dialog> */}
        <Dialog
          visible={this.state.selfCreateAccountVisible}
          onOk={this.onSelfCreateAccountOK.bind(this)}
          onCancel={this.onSelfCreateAccountClose.bind(this)}
          onClose={this.onSelfCreateAccountClose.bind(this)}
          title="账户创建"
          footerAlign="center"
        >
          <Select
            style={{ width: 400 }}
            placeholder="选择您拥有的账户(此账户用于创建新账户)"
            onChange={this.onChangeCreatorAccount.bind(this)}
            dataSource={this.state.accountNames}
          />
          <br />
          <br />
          <Input hasClear
            htmlType="password"
            onChange={this.handlePasswordChange.bind(this)}
            style={{ width: 400 }}
            addonBefore="钱包密码"
            size="medium"
            defaultValue=""
            maxLength={20}
            hasLimitHint
          />
          <br />
          <br />
          <Input hasClear
            onChange={this.handleNewAccountNameChange.bind(this)}
            style={{ width: 400 }}
            addonBefore="待创建账号"
            size="medium"
            defaultValue=""
            maxLength={16}
            hasLimitHint
            placeholder="由a-z0-9组成，长度8~16位"
          />
          <br />
          <br />

          <Select
            style={{ width: 400 }}
            placeholder="选择绑定本地已有公钥或在下面输入其它公钥"
            onChange={this.handleSelfPublicKeyChange.bind(this)}
          >
            {
            [...this.state.keystoreList, { publicKey: this.state.inputOtherPKStr }].map((keystore) => (
              <Select.Option value={keystore.publicKey} lable={keystore.publicKey}>
                {keystore.publicKey}
              </Select.Option>
            ))
          }

          </Select>
          <br />
          <br />
          <Input hasClear
            onChange={this.handleOthersPublicKeyChange.bind(this)}
            style={{ width: 400 }}
            addonBefore="其它公钥"
            size="medium"
            defaultValue=""
            maxLength={67}
            hasLimitHint
            disabled={!this.state.inputOtherPK}
            placeholder="若此处填入公钥，创建时将以此公钥为准"
          />
        </Dialog>

        <Dialog
          visible={this.state.bindNewAuthorVisible}
          onOk={this.onBindNewAuthorOK.bind(this)}
          onCancel={this.onBindNewAuthorClose.bind(this)}
          onClose={this.onBindNewAuthorClose.bind(this)}
          title="绑定新的权限拥有者"
          footerAlign="center"
        >
          <Input hasClear
            onChange={this.handleNewOwnerChange.bind(this)}
            style={{ width: 400 }}
            addonBefore="权限拥有者"
            size="medium"
            defaultValue=""
            maxLength={66}
            hasLimitHint
            placeholder='可输入账户名/公钥/地址'
          />
          <br />
          <br />
          <Input hasClear
            onChange={this.handleWeightChange.bind(this)}
            style={{ width: 400 }}
            addonBefore="权重"
            size="medium"
            defaultValue=""
            maxLength={10}
            hasLimitHint
          />
          <br />
          <br />
          <Input hasClear
            htmlType="password"
            onChange={this.handlePasswordChange.bind(this)}
            style={{ width: 400 }}
            addonBefore="钱包密码"
            size="medium"
            defaultValue=""
            maxLength={20}
            hasLimitHint
          />
        </Dialog>

        <Dialog
          visible={this.state.updateWeightVisible}
          onOk={this.onUpdateWeightOK.bind(this)}
          onCancel={this.onUpdateWeightClose.bind(this)}
          onClose={this.onUpdateWeightClose.bind(this)}
          title="更新权重"
          footerAlign="center"
        >
          <Input hasClear
            onChange={this.handleWeightChange.bind(this)}
            style={{ width: 400 }}
            addonBefore="权重"
            size="medium"
            defaultValue=""
            maxLength={10}
            hasLimitHint
          />
          <br />
          <br />
          <Input hasClear
            htmlType="password"
            onChange={this.handlePasswordChange.bind(this)}
            style={{ width: 400 }}
            addonBefore="钱包密码"
            size="medium"
            defaultValue=""
            maxLength={20}
            hasLimitHint
          />
        </Dialog>

        <Dialog
          visible={this.state.importAccountVisible}
          title="导入账户"
          footerActions="ok"
          footerAlign="center"
          closeable="true"
          onOk={this.onImportAccountOK.bind(this)}
          onCancel={this.onImportAccountClose.bind(this)}
          onClose={this.onImportAccountClose.bind(this)}
        >
          <Input hasClear
            onChange={this.handleImportAccountChange.bind(this)}
            style={{ width: 400 }}
            addonBefore="账号"
            size="medium"
            defaultValue=""
            maxLength={16}
            hasLimitHint
            onPressEnter={this.onImportAccountOK.bind(this)}
          />
        </Dialog>
        <Dialog
          style={{ width: 450 }}
          visible={this.state.authorListVisible}
          title="权限拥有者列表"
          footerActions="ok"
          footerAlign="center"
          closeable="true"
          onOk={this.onAuthorListClose.bind(this)}
          onCancel={this.onAuthorListClose.bind(this)}
          onClose={this.onAuthorListClose.bind(this)}
        >
          <div className="editable-table">
            <IceContainer>
              <Table primaryKey="owner" dataSource={this.state.authorList} hasBorder={false} resizable>
                <Table.Column title="所有者" dataIndex="owner" width={100} />
                <Table.Column title="权重" dataIndex="weight" width={100} />
                <Table.Column title="操作" width={150} cell={this.renderAuthorOperation.bind(this)} />
              </Table>
            </IceContainer>
          </div>
        </Dialog>

        <Dialog
          style={{ width: 450 }}
          visible={this.state.assetVisible}
          title="资产信息"
          footerActions="ok"
          footerAlign="center"
          closeable="true"
          onOk={this.onAssetClose.bind(this)}
          onCancel={this.onAssetClose.bind(this)}
          onClose={this.onAssetClose.bind(this)}
        >
          <div className="editable-table">
            <IceContainer>
              <Table primaryKey="assetID" dataSource={this.state.balanceInfos} hasBorder={false} resizable>
                <Table.Column title="资产ID" dataIndex="assetID" width={100} />
                <Table.Column title="资产符号" dataIndex="assetID" width={100} cell={this.symbolRender.bind(this)} />
                <Table.Column title="可用金额" dataIndex="balance" width={100} cell={this.balanceRender.bind(this)} />
                <Table.Column title="操作" width={150} cell={this.assetRender.bind(this)} />
              </Table>
            </IceContainer>
          </div>
        </Dialog>

        <Dialog
          style={{ width: 1000 }}
          visible={this.state.txVisible}
          title="交易信息"
          footerActions="ok"
          footerAlign="center"
          closeable="true"
          onOk={this.onTxClose.bind(this)}
          onCancel={this.onTxClose.bind(this)}
          onClose={this.onTxClose.bind(this)}
        >
          <div className="editable-table">
            <IceContainer>
              <Table primaryKey="date" dataSource={this.state.txInfos} hasBorder={false} resizable>
                <Table.Column title="时间" dataIndex="date" width={90} cell={this.renderDate.bind(this)} />
                <Table.Column title="交易Hash" dataIndex="txHash" width={90} />
                <Table.Column title="交易状态" dataIndex="txStatus" width={50} cell={this.renderTxStatus.bind(this)} />
                <Table.Column title="区块Hash" dataIndex="blockHash" width={90} />
                <Table.Column title="区块高度" dataIndex="blockNumber" width={50} />
                <Table.Column title="区块状态" dataIndex="blockStatus" width={50} cell={this.renderBlockStatus.bind(this)} />

                <Table.Column title="类型" dataIndex="parsedActions" width={80} cell={this.renderActionType.bind(this)} />
                <Table.Column title="详情" dataIndex="parsedActions" width={100} cell={this.renderDetailInfo.bind(this)} />
                <Table.Column title="结果" dataIndex="parsedActions" width={80} cell={this.renderResult.bind(this)} />
                <Table.Column title="总手续费" dataIndex="parsedActions" width={80} cell={this.renderGasFee.bind(this)} />
                <Table.Column title="手续费分配详情" dataIndex="parsedActions" width={100} cell={this.renderGasAllot.bind(this)} />

                {/* <Table.Column title="类型" width={50} dataIndex="actionType" cell={this.actionTypeRender.bind(this)}/>
                <Table.Column title="详情" width={200} dataIndex="detailInfo"/>
                <Table.Column title="结果" width={50} dataIndex="result"/> */}
              </Table>
            </IceContainer>
          </div>
        </Dialog>

        <Dialog
          visible={this.state.transferVisible}
          title="转账"
          footerActions="ok"
          footerAlign="center"
          closeable="true"
          onOk={this.onTransferOK.bind(this)}
          onCancel={this.onTransferClose.bind(this)}
          onClose={this.onTransferClose.bind(this)}
        >
          <Input hasClear
            onChange={this.handleTransferToAccountChange.bind(this)}
            style={{ width: 400 }}
            addonBefore="收款账号"
            size="medium"
            defaultValue=""
            maxLength={16}
            hasLimitHint
          />
          <br />
          <br />
          <Input hasClear
            onChange={this.handleTransferValueChange.bind(this)}
            style={{ width: 400 }}
            addonBefore="金额"
            addonAfter={this.state.transferAssetSymbol}
            size="medium"
            hasLimitHint
          />
          <br />
          <br />
          <Input hasClear
            onChange={this.handleGasPriceChange.bind(this)}
            style={{ width: 400 }}
            addonBefore="GAS单价"
            addonAfter="gaft"
            size="medium"
            placeholder={`建议值：${this.state.suggestionPrice}`}
            hasLimitHint
          />
          <br />
          1gaft = 10<sup>-9</sup>ft = 10<sup>9</sup>aft
          <br />
          <br />
          <Input hasClear
            onChange={this.handleGasLimitChange.bind(this)}
            style={{ width: 400 }}
            addonBefore="GAS数量上限"
            size="medium"
            hasLimitHint
          />
          <br />
          <br />
          <Input hasClear
            htmlType="password"
            onChange={this.handlePasswordChange.bind(this)}
            style={{ width: 400 }}
            addonBefore="钱包密码"
            size="medium"
            defaultValue=""
            maxLength={20}
            hasLimitHint
            onPressEnter={this.onTransferOK.bind(this)}
          />
        </Dialog>
      </div>
    );
  }
}

const styles = {
  addNewItem: {
    background: '#F5F5F5',
    height: 32,
    lineHeight: '32px',
    marginTop: 20,
    cursor: 'pointer',
    textAlign: 'center',
  },
};