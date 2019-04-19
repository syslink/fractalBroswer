import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table, Button, Select, Input, Dialog, Feedback } from '@icedesign/base';
import { Tag, Balloon } from '@alifd/next';

import BigNumber from 'bignumber.js';
import * as fractal from 'fractal-web3';

import { encode } from 'rlp';
import './EditableTable.scss';

import * as txParser from '../../../../utils/transactionParser';

import * as constant from '../../../../utils/constant';


const splitToken = ',';
const TxStatus = { SendError:1, NotExecute:2, ExecuteSuccess:3, ExecuteFail:4, Rollback:5 };

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
      accountReg: new RegExp('^[a-z0-9]{8,16}$'),
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
      importAccountVisible: false,
      authorListVisible: false,
      selfCreateAccountVisible: false,
      bindNewAuthorVisible: false,
      updateWeightVisible: false,
      accountInfos: [],
      authorList: [],
      accountNames: [],
      keystoreList: [],
    };
  }

  componentDidMount = async () => {
    this.props.getKeystore([]);

    this.state.dposInfo = fractal.dpos.getDposInfo();
    this.loadAccountsFromLS();
    this.loadKeystoreFromLS();
  }
  loadKeystoreFromLS = () => {
    const keystoreInfoStr = global.localStorage.getItem(constant.KeyStoreFile);
    if (keystoreInfoStr !== null) {
      const keystoreInfoObj = JSON.parse(keystoreInfoStr);
      this.state.keystoreList = keystoreInfoObj.keyList;
    }
  }
  loadAccountsFromLS = () => {
    const accountsStr = global.localStorage.getItem(constant.AccountFile);
    if (accountsStr != null) {
      const accounts = accountsStr.split(splitToken);
      for (const account of accounts) {
        const accountObj = fractal.account.getAccountByName(account);
        if (accountObj != null) {
          this.state.accountInfos.push(accountObj);
        } 
      }

      this.setState({accountInfos: this.state.accountInfos});
    }
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

  onImportAccountOK = () => {
    if (this.state.importAccountName == '') {
      Feedback.toast.error('请输入账号');
      return;
    }
    if (!this.state.accountReg.test(this.state.importAccountName)) {
      Feedback.toast.error('账号格式错误');
      return;
    }
    try {
        const account = fractal.account.getAccountByName(this.state.importAccountName);
        if (acount != null) {
          this.setState({accountInfos: this.state.accountInfos.push(account)});
          this.saveAccountsToLS();
        } else {
          Feedback.toast.error('账户不存在');
        }
    } catch (error) {
      Feedback.toast.error(error);
    }
  };

  onImportAccountClose = () => {
    this.setState({ importAccountVisible: false });
  }

  deleteItem = (index) => {
    this.state.accountInfos.splice(index, 1);
    this.setState({accountInfos: this.state.accountInfos.push(account)});
    this.saveAccountsToLS();
  };

  showAssets = async (index) => {
    this.state.curAccount = this.state.accountInfos[index];
    const balances = this.state.accountInfos[index].balances;
    for (const balance of balances) {
      if (this.state.assetInfos[balance.assetID] === undefined) {
        const asset = fractal.account.getAssetInfoById([balance.assetID]);
        this.state.assetInfos[balance.assetID] = asset;
      }
      if (balance.assetID === 1) {
        this.state.curAccountFTBalance = balance.balance;
      }
    }
    this.setState({
      assetVisible: true,
      balanceInfos: this.state.accountInfos[index].balances,
    });
  }
  /** 
   * 交易的n种状态：
   * 1: 发送失败
   * 2：发送成功，但尚未执行
   * 3：发送成功，执行成功
   * 4：发送成功，执行失败
   * 5：区块被回退
   * 6：内部交易成功
   * 7：内部交易失败
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
   * {account1:{lastBlockNum:100, txInfos:[{txStatus,date,txHash,blockHash,blockStatus,actions:[{actionType,from,to,assetId,amount,payload,status,index,gasUsed,gasAllot:[account,gas,typeId],error}],{...}]}}
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
        if (this.state.assetInfos[balance.assetID] === null) {
          const assetInfo = fractal.account.getAssetInfoById([balance.assetID]);
          this.state.assetInfos[balance.assetID] = assetInfo;
        }
      }

      const allTxInfoSet = global.localStorage.getItem(constant.TxInfoFile);
      if (allTxInfoSet !== null) {
        allTxInfoSet = JSON.parse(allTxInfoSet);
        const accountTxInfoSet = allTxInfoSet[this.state.curAccount.accountName];
        for (const txInfo of accountTxInfoSet.txInfos) {
          const parsedActions = [];
          let transaction = txInfo;
          
          for (const actionInfo of txInfo.actions) {
            if (this.state.assetInfos[actionInfo.assetID] === undefined) {
              const asset = fractal.account.getAssetInfoById(actionInfo.assetID);
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
  syncTxFromNode = () => {
    
  }
  renderActionType = (value, index, record) => {
    const parseActions = record.actions;
    return parseActions.map((item) => {
      const defaultTrigger = <Tag type="normal" size="small">{item.actionType}</Tag>;
      return <Balloon trigger={defaultTrigger} closable={false}>{item.actionType}</Balloon>;
    });
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
          查看资产
        </Button>
        &nbsp;&nbsp;
        <Button type="primary" onClick={this.showTxs.bind(this, index)}>
          查看交易
        </Button>
        &nbsp;&nbsp;
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
    this.props.createAccountBySelf(params);
  };

  onSelfCreateAccountClose = () => {
    this.setState({ selfCreateAccountVisible: true });
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
    if (assetInfo !== null) {
      return assetInfo.symbol;
    }
    assetInfo = fractal.account.getAssetInfoById(value);
    this.state.assetInfos[value] = assetInfo;
    if (assetInfo !== null) {
      return assetInfo.symbol;
    }
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
  transfer = (index) => {
    const assetID = this.state.balanceInfos[index].assetID;

    const gasPrice = fractal.ft.getSuggestionGasPrice();
    if (gasPrice > this.state.suggestionPrice) {
      this.state.suggestionPrice = gasPrice;
    }

    this.setState({
      transferVisible: true,
      transferAssetSymbol: this.state.assetInfos[assetID].symbol,
      curTransferAsset: this.state.assetInfos[assetID],
      curBalance: this.state.balanceInfos[index],
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

    if (this.state.transferValue == '') {
      Feedback.toast.error('请输入转账金额');
      return;
    }

    if (this.state.gasPrice == '') {
      Feedback.toast.error('请输入GAS单价');
      return;
    }

    if (this.state.gasLimit == '') {
      Feedback.toast.error('请输入愿意支付的最多GAS数量');
      return;
    }

    if (this.state.password == '') {
      Feedback.toast.error('请输入密码');
      return;
    }

    const decimals = this.state.curTransferAsset.decimals;
    const value = new BigNumber(this.state.transferValue).shiftedBy(decimals);

    const gasValue = new BigNumber(this.state.gasPrice).multipliedBy(this.state.gasLimit);
    const maxValue = new BigNumber(this.state.curBalance.balance);
    if (this.state.curTransferAsset.assetId == 1) {
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
      const ftValue = new BigNumber(this.state.curAccountFTBalance);
      if (gasValue.comparedTo(ftValue) > 0) {
        Feedback.toast.error('FT余额不足，可能无法支付足够GAS费');
        return;
      }
    }

    const transferInfo = { actionType: constant.TRANSFER,
      accountName: this.state.curAccount.accountName,
      toAccountName: this.state.transferToAccount,
      assetId: this.state.curTransferAsset.assetId,
      gasLimit: new BigNumber(this.state.gasLimit).toNumber(),
      gasPrice: new BigNumber(this.state.gasPrice).toNumber(),
      value: value.toNumber(),
      password: this.state.password };

    // 导入账户之前，先查询账户存在，然后再导入到节点钱包中
    //this.props.transfer(transferInfo);
  };

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
          <Table primaryKey="accountName" dataSource={this.state.accountInfos} hasBorder={false} isLoading={this.props.isLoading}>
            <Table.Column
              width={100}
              title="账号"
              dataIndex="accountName"
            />
            <Table.Column
              width={100}
              title="创建者"
              dataIndex="founder"
            />
            <Table.Column
              width={100}
              title="账号阈值"
              dataIndex="threshold"
            />
            <Table.Column
              width={100}
              title="注册区块"
              dataIndex="number"
            />
            <Table.Column
              width={100}
              title="是否合约账户"
              dataIndex="codeSize"
              cell={this.renderContract}
            />
            <Table.Column
              width={100}
              title="手续费分配率"
              dataIndex="chargeRatio"
            />
            <Table.Column title="操作" width={350} cell={this.renderOperation} />
          </Table>
          <div onClick={this.addAccountBySystem.bind(this)} style={styles.addNewItem}>
            + 新增账户(第三方免费帮您创建)
          </div>
          <div onClick={this.addAccountBySelf.bind(this)} style={styles.addNewItem}>
            + 新增账户(通过自己账户创建)
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
          onCancel={() => this.onSelfCreateAccountClose.bind(this)}
          onClose={() => this.onSelfCreateAccountClose.bind(this)}
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
          onCancel={() => this.onBindNewAuthorClose.bind(this)}
          onClose={() => this.onBindNewAuthorClose.bind(this)}
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
          onCancel={() => this.onUpdateWeightClose.bind(this)}
          onClose={() => this.onUpdateWeightClose.bind(this)}
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
          onCancel={() => this.onImportAccountClose}
          onClose={() => this.onImportAccountClose}
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
                <Table.Column title="时间" dataIndex="date" width={90} />
                <Table.Column title="交易Hash" dataIndex="txHash" width={150} />

                <Table.Column title="类型" dataIndex="parsedActions" width={150} cell={this.renderActionType.bind(this)} />
                <Table.Column title="详情" dataIndex="parsedActions" width={200} cell={this.renderDetailInfo.bind(this)} />
                <Table.Column title="结果" dataIndex="parsedActions" width={100} cell={this.renderResult.bind(this)} />
                <Table.Column title="总手续费" dataIndex="parsedActions" width={100} cell={this.renderGasFee.bind(this)} />
                <Table.Column title="手续费分配详情" dataIndex="parsedActions" width={150} cell={this.renderGasAllot.bind(this)} />

                {/* <Table.Column title="类型" width={50} dataIndex="actionType" cell={this.actionTypeRender.bind(this)}/>
                <Table.Column title="详情" width={200} dataIndex="detailInfo"/>
                <Table.Column title="结果" width={50} dataIndex="result"/> */}
              </Table>
            </IceContainer>
          </div>
        </Dialog>

        <Dialog
          visible={this.props.transferVisible}
          title="转账"
          footerActions="ok"
          footerAlign="center"
          closeable="true"
          onOk={this.onTransferOK.bind(this)}
          onCancel={() => this.props.closeDialogOfTransfer()}
          onClose={() => this.props.closeDialogOfTransfer()}
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
          1gaft = 10<sup>-9</sup>ft
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