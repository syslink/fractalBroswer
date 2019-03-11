import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table, Button, Select } from '@icedesign/base';
import CellEditor from './CellEditor';
import './EditableTable.scss';
import { Input, Dialog, Feedback } from '@icedesign/base';
import { Tag, Balloon } from '@alifd/next';

import * as txParser from '../../../../utils/transactionParser';

import injectReducer from '../../../../utils/injectReducer';

import { bindAccountAddr, deleteBoundInfo, updateBoundInfo, 
         getBoundInfo, getKeystore, createAccountBySystem, 
         getAccountInfo, createAccountBySelf, importAccount, transfer,
         openDialogOfCreateAccountBySelf, openDialogOfCreateAccountBySystem, openDialogOfTransfer, openDialogOfImportAccount,
         closeDialogOfCreateAccountBySelf, closeDialogOfCreateAccountBySystem, closeDialogOfTransfer, closeFailDialog, closeDialogOfImportAccount,
         openDialogOfUpdatePK, closeDialogOfUpdatePK, updatePK } from '../../actions';
import {TRANSFER, CREATE_NEW_ACCOUNT, UPDATE_ACCOUNT} from '../../../../utils/constant'
import {getAssetInfoById, getSuggestionGasPrice, getTransactionByHash, getTransactionReceipt, sendTransaction, getDposInfo} from '../../../../api'

import reducer from '../../reducer';

import { connect } from 'react-redux';
import { compose } from 'redux';
import BigNumber from "bignumber.js"

import cookie from 'react-cookies'
import {encode} from 'rlp'
import { str2Bytes } from '../../../../utils/utils';

class EditableTable extends Component {
  static displayName = 'EditableTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      creator: '',
      fractalAccount: '',
      selfAccount: '',
      accountReg: new RegExp("^[a-z0-9]{8,16}$"),
      fractalPublicKey: '',
      selfPublicKey: '',
      otherPublicKey: '',
      email: '',
      emailReg: new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"),
      systemAccount: "ftsystemio",
      emailDisable: false,
      password: '',
      passwordDisable: false,
      addresses: [],
      balanceInfos: [],
      assetInfos: {},
      importAccountVisible: false,
      importAccountName: '',
      assetVisible: false,
      curBalance: {},
      curTransferAsset: {},
      curAccount: '',
      curAccountFTBalance: '',
      transferFromAccount: '',
      transferToAccount: '',
      transferValue: 0,
      transferAssetId: 0,
      transferAssetSymbol: '',
      suggestionPrice: 10,
      gasPrice: 0,
      gasLimit: 0,
      txVisible: false,
      txInfos: [],
      inputOtherPK: false,
      inputOtherPKStr: '输入其它公钥',
      successCallback: () => {},
      errCallback: (error) => {},
    };
  }

  // mapStateToProps执行后会调用此函数
  compoentWillMount() {

  }

  componentDidMount() {
    this.props.getKeystore([]);
  }

  renderOrder = (value, index) => {
    return <span>{index}</span>;
  };

  deleteItem = (index) => {
    this.props.deleteBoundInfo([this.props.accountInfos[index].accountName]);
  };

  showAssets = async (index) => {
    const _this = this;
    this.state.curAccount = this.props.accountInfos[index];
    var balances = this.props.accountInfos[index].balances;
    for (let balance of balances) {
      if (_this.state.assetInfos[balance.assetID] == undefined) {
        var resp = await getAssetInfoById([balance.assetID]);
        _this.state.assetInfos[balance.assetID] = resp.data.result;
      }
      if (balance.assetID == 1) {
        _this.state.curAccountFTBalance = balance.balance;
      }
    }
    this.setState({
      assetVisible: true,
      balanceInfos: this.props.accountInfos[index].balances,
    });
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

  showTxs = async (index) => {
    try {
      this.state.curAccount = this.props.accountInfos[index];
      for (let balance of this.props.accountInfos[index].balances) {
        if (this.state.assetInfos[balance.assetID] == undefined) {
          var resp = await getAssetInfoById([balance.assetID]);
          console.log(resp);
          this.state.assetInfos[balance.assetID] = resp.data.result;
        }
      }

      var dposInfo;
      dposInfo = {};
      var dposResp = await getDposInfo();
      if (dposResp.data.hasOwnProperty('result') && dposResp.data.result != null) {
        dposInfo = dposResp.data.result;
      }

      var txInfoSet = cookie.load(this.state.curAccount.accountName);
      if (txInfoSet != undefined) {
        var txInfos = [];
        for (let txInfo of txInfoSet) {
          var txResp = await getTransactionByHash([txInfo.txHash]);
          if (txResp.data.result != undefined) {
            var transaction = txResp.data.result;
            var parsedActions = [];
            var i = 0;
            var receiptResp = await getTransactionReceipt([txInfo.txHash]);
            var actionResults = receiptResp.data.result.actionResults;
            for (let actionInfo of transaction.actions) {
              if (this.state.assetInfos[actionInfo.assetID] == undefined) {
                var resp = await getAssetInfoById([actionInfo.assetID]);
                this.state.assetInfos[actionInfo.assetID] = resp.data.result;
              }
              var parsedAction = txParser.parseAction(actionInfo, this.state.assetInfos[actionInfo.assetID], this.state.assetInfos, dposInfo);
              parsedAction['result'] = actionResults[i].status == 1 ? '成功' : '失败（' + actionResults[i].error + '）';
              parsedAction['gasFee'] = actionResults[i].gasUsed + 'aft';
              parsedAction['gasAllot'] = actionResults[i].gasAllot;
              parsedActions.push(parsedAction);
              i++;
            }
            transaction["actions"] = parsedActions;
            transaction["date"] = txInfo.date;
            txInfos.push(transaction);
          }
        }
        this.setState({
          txVisible: true,
          txInfos: txInfos,
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
        <Button type="primary" onClick={this.updatePublicKey.bind(this, index)}>
          更换公钥
        </Button>
      </view>
    );
  };


  updatePublicKey = (index) => {

    this.state.curAccount = this.props.accountInfos[index];
    this.props.openDialogOfUpdatePK();
  }

  onUpdatePKOK = (index) => {
    if (this.state.selfPublicKey == '' && this.state.otherPublicKey == '') {
      Feedback.toast.error("请选择或输入公钥");
      return;
    }
    if (this.state.password == '') {
      Feedback.toast.error("请输入密码");
      return;
    }
    var publicKey = this.state.otherPublicKey;
    if (publicKey == '') {
      publicKey = this.state.selfPublicKey;
    }

    var founder = this.state.curAccount.founder;
    if (founder == '') {
      founder = this.state.curAccount.accountName;
    }

    var rlpData = encode([founder, this.state.curAccount.chargeRatio, publicKey])
    var params = {
      accountName: this.state.curAccount.accountName,
      actionType: UPDATE_ACCOUNT,
      data: '0x' + rlpData.toString('hex'),
      password: this.state.password,
    };

    this.props.updatePK(params);
  }

  transfer = async (index) => {
    var assetID = this.state.balanceInfos[index].assetID;

    var resp = await getSuggestionGasPrice();
    if (resp.data.result > this.state.suggestionPrice) {
      this.state.suggestionPrice = resp.data.result;
    }

    this.props.openDialogOfTransfer();
    this.setState({
      transferAssetId: assetID,
      transferAssetSymbol: this.state.assetInfos[assetID].symbol,
      curTransferAsset: this.state.assetInfos[assetID],
      curBalance: this.state.balanceInfos[index],
    });
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
  changeDataSource = (index, valueKey, value) => {
    this.state.dataSource[index][valueKey] = value;
    this.setState({
      dataSource: this.state.dataSource,
    });
  };

  renderEditor = (valueKey, value, index, record) => {
    return (
      <CellEditor
        valueKey={valueKey}
        index={index}
        value={record[valueKey]}
        onChange={this.changeDataSource}
      />
    );
  };

  addAccountBySystem = () => {
    this.props.openDialogOfCreateAccountBySystem();
  }

  addAccountBySelf = () => {
    this.props.openDialogOfCreateAccountBySelf();
  }

  onImportAccount = () => {
    this.props.openDialogOfImportAccount();
  }

  onSystemCreatAccountOK = () => {
    if (!this.state.accountReg.test(this.state.fractalAccount)) {
      Feedback.toast.error("账号格式错误");
      return;
    }
    if (this.state.fractalPublicKey == '') {
      Feedback.toast.error("请选择公钥");
      return;
    }
    if (!this.state.emailReg.test(this.state.email)) {
      Feedback.toast.error("邮箱格式错误");
      return;
    }
    this.props.createAccountBySystem({accountName:this.state.fractalAccount, publicKey:this.state.fractalPublicKey, email:this.state.email});
  };

  onSelfOK = () => {
    if (this.state.creator == '') {
      Feedback.toast.error("请选择创建者账号");
      return;
    }
    if (!this.state.accountReg.test(this.state.selfAccount)) {
      Feedback.toast.error("账号格式错误");
      return;
    }
    if (this.state.selfPublicKey == '' && this.state.otherPublicKey == '') {
      Feedback.toast.error("请选择或输入公钥");
      return;
    }
    if (this.state.password == '') {
      Feedback.toast.error("请输入密码");
      return;
    }
    var publicKey = this.state.otherPublicKey;
    if (publicKey == '') {
      publicKey = this.state.selfPublicKey;
    }
    var rlpData = encode([this.state.selfAccount, '', 0, this.state.selfPublicKey]);

    var params = {accountName:this.state.creator, 
                  data:'0x' + rlpData.toString('hex'), 
                  actionType:CREATE_NEW_ACCOUNT,
                  toAccountName:this.state.selfAccount,
                  password:this.state.password
                  };
    this.props.createAccountBySelf(params); 
  };

  onAssetClose = () => {
    this.setState({
      assetVisible: false
    });
  };

  onTxClose = () => {
    this.setState({
      txVisible: false
    });
  };

  onImportAccountOK = () => {
    if (this.state.importAccountName == '') {
      Feedback.toast.error("请输入账号");
      return;
    }
    if (!this.state.accountReg.test(this.state.importAccountName)) {
      Feedback.toast.error("账号格式错误");
      return;
    }
    // 导入账户之前，先查询账户存在，然后再导入到节点钱包中
    this.props.importAccount([this.state.importAccountName]);
  };
  onImportAccountClose = () => {
    this.setState({
      importAccountVisible: false
    });
  };

  onTransferOK = () => {
    if (this.state.transferToAccount == '') {
      Feedback.toast.error("请输入账号");
      return;
    }
    if (!this.state.accountReg.test(this.state.transferToAccount)) {
      Feedback.toast.error("账号格式错误");
      return;
    }
    
    if (this.state.transferValue == '') {
      Feedback.toast.error("请输入转账金额");
      return;
    }
    
    if (this.state.gasPrice == '') {
      Feedback.toast.error("请输入GAS单价");
      return;
    }
    
    if (this.state.gasLimit == '') {
      Feedback.toast.error("请输入愿意支付的最多GAS数量");
      return;
    }

    if (this.state.password == '') {
      Feedback.toast.error("请输入密码");
      return;
    }

    var decimals = this.state.curTransferAsset.decimals;
    var value = new BigNumber(this.state.transferValue).shiftedBy(decimals);

    var gasValue = new BigNumber(this.state.gasPrice).multipliedBy(this.state.gasLimit);
    if (this.state.curTransferAsset.assetId == 1) {
      var valueAddGasFee = value.plus(gasValue);
      var maxValue = new BigNumber(this.state.curBalance.balance);
      
      if (valueAddGasFee.comparedTo(maxValue) > 0) {
        Feedback.toast.error("余额不足");
        return;
      }
    } else {
      if (value.comparedTo(maxValue) > 0) {
        Feedback.toast.error("余额不足");
        return;
      }
      var ftValue = new BigNumber(this.state.curAccountFTBalance);
      if (gasValue.comparedTo(ftValue) > 0) {
        Feedback.toast.error("FT余额不足，可能无法支付足够GAS费");
        return;
      }
    }

    var transferInfo = {"actionType": TRANSFER, 
                        "accountName": this.state.curAccount.accountName, 
                        "toAccountName":this.state.transferToAccount, 
                        "assetId": this.state.curTransferAsset.assetId, 
                        "gasLimit": new BigNumber(this.state.gasLimit).toNumber(), 
                        "gasPrice": new BigNumber(this.state.gasPrice).toNumber(), 
                        "value": value.toNumber(),
                        "password":this.state.password}

    // 导入账户之前，先查询账户存在，然后再导入到节点钱包中
    this.props.transfer(transferInfo);
  };

  actionTypeRender = (value, index) => {
    switch(value) {
      case 0:
        return '转账';
      case 256:
      return '创建账户';
    }
  }
  
  detailInfoRender = async (txHash, index) => {
    var resp = await getTransactionByHash([txHash]);
    return resp;
  }

  txResultRender = async (txHash, index) => {
    var resp = await getTransactionReceipt([txHash]);
    return resp;
  }

  handlePasswordChange(v, e) {
    this.state.password = v;
  }

  handleFractalPublicKeyChange(v, e) {
    this.state.fractalPublicKey = v;
  }
  handleEmailChange(v, e) {
    this.state.email = v;
  }
  handleFractalAccountNameChange(v, e) {
    this.state.fractalAccount = v;
  }
  handleSelfPublicKeyChange(v, e) {
    this.state.selfPublicKey = v;
    if (v == this.state.inputOtherPKStr) {
      this.setState({inputOtherPK: true});
    } else {
      this.setState({inputOtherPK: false, otherPublicKey: ''});
    }
  }
  handleOthersPublicKeyChange(v, e) {
    this.setState({otherPublicKey: v});
  }
  handleSelfAccountNameChange(v, e) {
    this.state.selfAccount = v;
  }
  handleImportAccountChange(v, e) {
    this.state.importAccountName = v;
  }
  handleTransferToAccountChange(v, e) {
    this.state.transferToAccount = v;
  }
  handleTransferValueChange(v, e) {
    this.state.transferValue = v;
  }
  handleGasPriceChange(v, e) {
    this.state.gasPrice = v;
  }
  handleGasLimitChange(v, e) {
    this.state.gasLimit = v;
  }
  handleTransferValueChange(v, e) {
    this.state.transferValue = v;
  }

  onChangeCreatorAccount(value) {
    this.state.creator = value;
  }
  renderValid = (value, index) => {
    if (value) {
        return '有效';
    }
    return '无效(因无私钥)';
  }

  symbolRender = (value, index) => {
    var assetInfo = this.state.assetInfos[value];
    if (assetInfo != undefined) {
      return assetInfo.symbol;
    }
    var _this = this;
    getAssetInfoById([value]).then(resp => {
      _this.state.assetInfos[value] = resp.data.result;
      _this.setState({
        assetInfos: _this.state.assetInfos,
      });
    });
  }
  balanceRender = (value, index) => {
    let {assetInfos, balanceInfos} = this.state;
    var decimals = assetInfos[balanceInfos[index].assetID].decimals;
    //var baseValue = new BigNumber(10).pow(decimals);

    var renderValue = new BigNumber(value);
    renderValue = renderValue.shiftedBy(decimals * -1);
    
    BigNumber.config({ DECIMAL_PLACES: 6 });
    renderValue = renderValue.toString(10);
    return renderValue;
  }
  onClose = () => {
    this.setState({
      visible: false
    });
  };

  renderActionType = (value, index, record) => {
    var parseActions = record.actions;
    return parseActions.map((item)=>{
      var defaultTrigger = <Tag type="normal" size="small">{item.actionType}</Tag>;
      return <Balloon  trigger={defaultTrigger} closable={false}>{item.actionType}</Balloon>;
    });
  }

  renderDetailInfo = (value, index, record) => {
    var parseActions = record.actions;
    return parseActions.map((item)=>{
      var defaultTrigger = <Tag type="normal" size="small">{item.detailInfo}</Tag>;
      return <Balloon  trigger={defaultTrigger} closable={false}>{item.detailInfo}</Balloon>;
    });
  }

  renderResult = (value, index, record) => {
    var parseActions = record.actions;
    return parseActions.map((item)=>{
      var defaultTrigger = <Tag type="normal" size="small">{item.result}</Tag>;
      return <Balloon  trigger={defaultTrigger} closable={false}>{item.result}</Balloon>;
    });
  }

  renderGasFee = (value, index, record) => {
    var parseActions = record.actions;
    return parseActions.map((item)=>{
      var defaultTrigger = <Tag type="normal" size="small">{item.gasFee}</Tag>;
      return <Balloon  trigger={defaultTrigger} closable={false}>{item.gasFee}</Balloon>;
    });
  }

  renderGasAllot = (value, index, record) => {
    var parseActions = record.actions;
    return parseActions[0].gasAllot.map((gasAllot) => {
              var defaultTrigger = <Tag type="normal" size="small">{gasAllot.account}->{gasAllot.gas}aft</Tag>;
              return <Balloon  trigger={defaultTrigger} closable={false}>{gasAllot.account}->{gasAllot.gas}aft</Balloon>;
            });
  }

  render() {
    return (
      <div className="editable-table">
        <IceContainer>
          <Table primaryKey="accountName" dataSource={this.props.accountInfos} hasBorder={false} isLoading={this.props.isLoading}>
            <Table.Column
              width={150}
              title="账号"
              dataIndex='accountName'
            />
            <Table.Column
              width={200}
              title="绑定的公钥"
              dataIndex='publicKey'
            />
            <Table.Column
              width={100}
              title="是否有效"
              dataIndex='valid'
              cell={this.renderValid}
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
        <Dialog
          visible={this.props.systemHelpVisible}
          onOk={this.onSystemCreatAccountOK.bind(this)}
          onCancel={() => this.props.closeDialogOfCreateAccountBySystem()}
          onClose={() => this.props.closeDialogOfCreateAccountBySystem()}
          title="账户创建"
          footerAlign='center'
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
            style={{width: 400}}
            placeholder="选择公钥，此公钥将同账户绑定，账户所有者有权更换"
            onChange={this.handleFractalPublicKeyChange.bind(this)}
            label={`公钥：`}
          >
          {
            this.props.keystoreInfo.map((keystore) => (
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
        </Dialog>
        <Dialog
          visible={this.props.selfHelpVisible}
          onOk={this.onSelfOK.bind(this)}
          onCancel={() => this.props.closeDialogOfCreateAccountBySelf()}
          onClose={() => this.props.closeDialogOfCreateAccountBySelf()}
          title="账户创建"
          footerAlign='center'
        >
          <Select
            style={{width: 400}}
            placeholder="选择您拥有的账户"
            onChange={this.onChangeCreatorAccount.bind(this)}
            dataSource={this.props.accountNames}
          ></Select>
          <br />
          <br />
          <Input hasClear
            htmlType="password"
            onChange={this.handlePasswordChange.bind(this)} 
            style={{ width: 400 }}
            addonBefore="密码"
            size="medium"
            defaultValue=""
            maxLength={20}
            hasLimitHint
            placeholder="此密码与以上创建者账户绑定的公私钥相对应"
          />
          <br />
          <br />
          <Input hasClear
            onChange={this.handleSelfAccountNameChange.bind(this)} 
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
            style={{width: 400}}
            placeholder="选择绑定本地已有公钥或在下面输入其它公钥"
            onChange={this.handleSelfPublicKeyChange.bind(this)}
          >
          {
            [...this.props.keystoreInfo, {publicKey:this.state.inputOtherPKStr} ].map((keystore) => (
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
            value={this.state.otherPublicKey}
            maxLength={67}
            hasLimitHint
            disabled={!this.state.inputOtherPK}
            placeholder="若此处填入公钥，创建时将以此公钥为准"
          />
        </Dialog>

        <Dialog
          visible={this.props.updatePKVisible}
          onOk={this.onUpdatePKOK.bind(this)}
          onCancel={() => this.props.closeDialogOfUpdatePK()}
          onClose={() => this.props.closeDialogOfUpdatePK()}
          title="更新公钥"
          footerAlign='center'
        >
          <Select
            style={{width: 400}}
            placeholder="选择绑定本地已有公钥或在下面输入其它公钥"
            onChange={this.handleSelfPublicKeyChange.bind(this)}
            //dataSource={}
          >
            {
              [...this.props.keystoreInfo, {publicKey:this.state.inputOtherPKStr}].map((keystore) => {
                return (
                  <Select.Option value={keystore.publicKey} lable={keystore.publicKey} 
                                 disabled={this.state.curAccount.publicKey == keystore.publicKey}>
                    {keystore.publicKey}
                  </Select.Option>
                )
              }, this)
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
            value={this.state.otherPublicKey}
            disabled={!this.state.inputOtherPK}
          />
          <br />
          <br />
          <Input hasClear
            htmlType="password"
            onChange={this.handlePasswordChange.bind(this)} 
            style={{ width: 400 }}
            addonBefore="密码"
            size="medium"
            defaultValue=""
            maxLength={20}
            hasLimitHint
            placeholder="此密码与账户绑定的公私钥相对应"
          />
        </Dialog>

        <Dialog
          visible={this.state.msgVisible}
          title="通知"
          footerActions='ok'
          footerAlign='center'
          closeable='true'
          onOk={this.onMsgClose}
          onCancel={this.onMsgClose}
          onClose={this.onMsgClose}
        >
          {this.state.msgContent}
        </Dialog>  
        <Dialog
          visible={this.props.failed}
          title="错误信息"
          footerActions='ok'
          footerAlign='center'
          closeable='true'
          onOk={this.onClose.bind(this)}
          onCancel={this.onClose.bind(this)}
          onClose={this.onClose.bind(this)}
        >
          {this.props.failInfo}
        </Dialog>  
        <Dialog
          visible={this.props.importAccountVisible}
          title="导入账户"
          footerActions='ok'
          footerAlign='center'
          closeable='true'
          onOk={this.onImportAccountOK.bind(this)}
          onCancel={() => this.props.closeDialogOfImportAccount()}
          onClose={() => this.props.closeDialogOfImportAccount()}
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
          visible={this.state.assetVisible}
          title="资产信息"
          footerActions='ok'
          footerAlign='center'
          closeable='true'
          onOk={this.onAssetClose.bind(this)}
          onCancel={this.onAssetClose.bind(this)}
          onClose={this.onAssetClose.bind(this)}
        >
          <div className="editable-table">
            <IceContainer>
              <Table primaryKey="assetID" dataSource={this.state.balanceInfos} hasBorder={false} resizable={true}>
                <Table.Column title="资产ID" dataIndex="assetID" width={100}/>
                <Table.Column title="资产符号" dataIndex="assetID" width={100} cell={this.symbolRender.bind(this)} />
                <Table.Column title="可用金额" dataIndex="balance" width={100} cell={this.balanceRender.bind(this)}/>
                <Table.Column title="操作" width={150} cell={this.assetRender.bind(this)}/>
              </Table>
            </IceContainer>
          </div>
        </Dialog>  

        <Dialog
          style={{ width: 1000 }}
          visible={this.state.txVisible}
          title="交易信息"
          footerActions='ok'
          footerAlign='center'
          closeable='true'
          onOk={this.onTxClose.bind(this)}
          onCancel={this.onTxClose.bind(this)}
          onClose={this.onTxClose.bind(this)}
        >
          <div className="editable-table">
            <IceContainer>
              <Table primaryKey="date" dataSource={this.state.txInfos} hasBorder={false} resizable={true}>
                <Table.Column title="时间" dataIndex="date" width={90}/>
                <Table.Column title="交易Hash" dataIndex="txHash" width={150} />

                <Table.Column title="类型" dataIndex="parsedActions" width={150} cell={this.renderActionType.bind(this)}/>
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
          footerActions='ok'
          footerAlign='center'
          closeable='true'
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
            addonBefore={"金额"}
            addonAfter={this.state.transferAssetSymbol}
            size="medium"
            hasLimitHint
          />
          <br />
          <br />
          <Input hasClear
            onChange={this.handleGasPriceChange.bind(this)} 
            style={{ width: 400 }}
            addonBefore='GAS单价'
            addonAfter='aft'
            size="medium"
            placeholder={"建议值：" + this.state.suggestionPrice}
            hasLimitHint
          />
          <br/>
          1aft = 10<sup>-18</sup>ft
          <br />
          <br />
          <Input hasClear
            onChange={this.handleGasLimitChange.bind(this)} 
            style={{ width: 400 }}
            addonBefore={"GAS数量上限"}
            size="medium"
            hasLimitHint
          />
          <br />
          <br />
          <Input hasClear
            htmlType="password"
            onChange={this.handlePasswordChange.bind(this)} 
            style={{ width: 400 }}
            addonBefore="密码"
            size="medium"
            defaultValue=""
            maxLength={20}
            hasLimitHint
            placeholder="此密码与付款账户绑定的公私钥相对应"
          />
        </Dialog>  

        <Dialog
          visible={this.props.failInfo != ''}
          title="错误信息"
          footerActions='ok'
          footerAlign='center'
          closeable='true'
          onOk={() => this.props.closeFailDialog()}
          onCancel={() => this.props.closeFailDialog()}
          onClose={() => this.props.closeFailDialog()}
        >
          {this.props.failInfo}
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

const mapDispatchToProps = {
  bindAccountAddr, 
  deleteBoundInfo, 
  updateBoundInfo, 
  getBoundInfo, 
  getKeystore, 
  createAccountBySystem, 
  getAccountInfo,
  createAccountBySelf,
  importAccount,
  transfer,
  openDialogOfCreateAccountBySystem,
  closeDialogOfCreateAccountBySystem,
  openDialogOfCreateAccountBySelf,
  closeDialogOfCreateAccountBySelf,
  openDialogOfTransfer,
  closeDialogOfTransfer,
  closeFailDialog,
  openDialogOfImportAccount,
  closeDialogOfImportAccount,
  openDialogOfUpdatePK, 
  closeDialogOfUpdatePK, 
  updatePK
};


// 参数state就是redux提供的全局store，而keystoreInfo会成为本组件的this.props的其中一个成员
const mapStateToProps = (state) => {
  console.log("mapStateToProps:" + state.accountManager.accountInfos.length + "--" + state.accountManager.accountInfos);
  var accountNameList = []
  state.accountManager.accountInfos.map(item => accountNameList.push(item.accountName));

  var publicKeyList = []
  state.accountManager.keystoreInfo.map(item => publicKeyList.push(item.publicKey));


  return { 
    publicKeys: publicKeyList,
    keystoreInfo: state.accountManager.keystoreInfo,
    accountNames: accountNameList,
    isLoading: state.accountManager.isLoading,
    createAccountResult: state.accountManager.createAccountResult,
    accountInfos: state.accountManager.accountInfos,
    failInfo: state.accountManager.failInfo,
    txHash: state.accountManager.txHash,
    selfHelpVisible: state.accountManager.selfHelpVisible,
    systemHelpVisible: state.accountManager.systemHelpVisible,
    transferVisible: state.accountManager.transferVisible,
    importAccountVisible: state.accountManager.importAccountVisible,
    updatePKVisible: state.accountManager.updatePKVisible,
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'accountManager', reducer });

export default compose(
  withReducer,
  withConnect
)(EditableTable);
