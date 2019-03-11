/* eslint no-mixed-operators:0 */
import React, { Component } from 'react';
import { Table, Button, Tag, Balloon, Icon } from '@alifd/next';
import * as rpc from '../../api'
import { FT_ASSET_ID, FT_DECIMALS } from '../../utils/constant';

import { Input, Dialog, Select, Feedback } from '@icedesign/base';
import BigNumber from 'bignumber.js';
import * as ACTION from '../../utils/constant';
import {encode} from 'rlp';
import {saveTxHash} from '../../utils/utils'

const VOTER = 1;
const PRODUCER = 2;
const OTHER = 3;

export default class ProducerList extends Component {
  static displayName = 'ProducerList';


  constructor(props) {
    super(props);

    this.state = {
      rowSelection: {
        mode: 'single',
        onChange: this.onChange.bind(this),
        onSelect: function(selected, record, records) {
            console.log('onSelect', selected, record, records);
        },
        selectedRowKeys: [],
        getProps: (record) => {
            return {
                disabled: record.id === 100306660941
            };
        }
      },
      accounts: [],
      producerList: [],
      myVoteInfoSet: {},
      voteVisible: false,
      maxStakeTooltip: '',
      voteAccount: {},
      canVoteAccounts: [],
      dposInfo: {},
      accountMaxStake: 0,

      inputPasswordVisible: false,
      removeVoterVisible: false,
      registerProducerVisible: false,
      updateProducerVisible: false,
      unRegisterProducerVisible: false,
      changeProducerVisible: false,

      cancelVoteDisable: false,
      canRegisterProducer: false,
      bMyProducer: true,

      myProducers: [],
      myVoterAccounts: [],
      otherAccounts: [],

      passwordTooltip: '',

      myVoters2Producer: [],
      myRestVoters2Producer:[],
    };
  }

  componentDidMount = async () => {
    var myVoterAccounts = [];
    var myProducers = [];
    var otherAccounts = [];
    var response = await rpc.getBoundInfo([]);
    if (response.data.hasOwnProperty("result") && response.data.result != undefined) {
      var accounts = [];
      var voteInfoSet = {};
      for (let account of response.data.result) {
        account.label = account.accountName;
        account.value = account.accountName;
        accounts.push(account);
        var voteInfo = await this.getAccountVoteInfo(account.accountName);
        if (voteInfo != null) {
          switch(voteInfo.accountType) {
            case VOTER:
              var voter = voteInfo.result;
              voter.label = voter.name;
              voter.value = voter.name;
              if (voteInfoSet[voteInfo.result.producer] == null) {
                var voteInfos = [];
                voteInfos.push(voter);
                voteInfoSet[voteInfo.result.producer] = voteInfos;
              } else {
                voteInfoSet[voteInfo.result.producer].push(voter);
              }
              myVoterAccounts.push(account);
              break;
            case PRODUCER:
              myProducers.push(account);
              break;
            case OTHER:
              otherAccounts.push(account);
              break;
          }
        } else {
          otherAccounts.push(account);
        }
      }
      this.state.accounts = accounts;
      this.state.myVoteInfoSet = voteInfoSet;
      this.state.myVoterAccounts = myVoterAccounts;
    }

    var resp = await rpc.getProducers();
    var producers = [];
    if (resp.data.hasOwnProperty('result') && resp.data.result != null) {
      for(let producer of resp.data.result) {
        producer['myVote'] = this.state.myVoteInfoSet[producer.name];
        producer['isMyProducer'] = this.isMyProducer(producer, myProducers);
        producers.push(producer);
      }
    }

    var dposInfo;
    resp = await rpc.getDposInfo();
    if (resp.data.hasOwnProperty('result') && resp.data.result != null) {
      dposInfo = resp.data.result;
    }

    this.setState({producerList: producers, 
                   dposInfo,
                   myVoterAccounts,
                   myProducers,
                   otherAccounts});
  }

  getAccountVoteInfo = async (accountName) => {
    var resp = await rpc.getDposAccountInfo([accountName]);
    if (resp.data.hasOwnProperty('result') && resp.data.result != null) {
      var result = resp.data.result;
      var accountType = this.getAccountType(result);
      return {accountType: accountType, result: result};
    }
    return null;
  }
  
  getAccountType = (result) => {
    if (result.hasOwnProperty("url") && result.hasOwnProperty("totalQuantity")) {
      return PRODUCER;
    } else if (result.hasOwnProperty("producer")) {
      return VOTER;
    } else {
      return OTHER;
    }
  }

  onChange(ids, records) {
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = ids;
    var bMyProducer = this.isMyProducer(records[0]);
    this.setState({ rowSelection, 
                    //cancelVoteDisable: records[0].myVote == null, 
                    voteAccount: records[0].myVote,
                    myVoters2Producer: records[0].myVote,
                    canRegisterProducer: this.state.otherAccounts.length > 0,
                    passwordTooltip: records[0].myVote != null ? records[0].myVote.name : '',
                  });
  }

  isMyProducer = (producer, myProducers) => {
    var myProducerList = this.state.myProducers;
    if (myProducers != undefined) {
      myProducerList = myProducers;
    }
    for(let myProducer of myProducerList) {
      if(myProducer.accountName === producer.name) {
        return true;
      }
    }
    return false;
  }

  getVotableAccountNames = () => {
    var hasVotedAccountNames = '';
    for (let key in this.state.myVoteInfoSet) {
      hasVotedAccountNames += this.state.myVoteInfoSet[key].name + "+";
    }
    var producers = '';
    for (let producer of this.state.producerList) {
      producers += producer.name + "+";
    }
    var canVoteAccounts = [];
    for (let account of this.state.accounts) {
      if (hasVotedAccountNames.indexOf(account.accountName) < 0 && producers.indexOf(account.accountName) < 0) {
        canVoteAccounts.push({label:account.accountName, value:account.accountName, originValue:account});
      }
    }
    return canVoteAccounts;
  }

  vote = () => {
    if(this.state.rowSelection.selectedRowKeys.length == 0) {
      Feedback.toast.error("请选择需要投票的生产者账号");
      return;
    }
    this.setState({voteVisible: true, canVoteAccounts: this.getVotableAccountNames()});
  }
  onVoteOK = async () => {
    var stake = parseInt(this.state.stake);
    if (new BigNumber(stake).comparedTo(this.state.accountMaxStake) > 0) {
      Feedback.toast.error("已超过最大投票数，无法进行投票");
      return;
    }
    var params = {};
    params.actionType = ACTION.VOTE_PRODUCER;
    params.accountName = this.state.voteAccount.accountName;
    params.password = this.state.password;
    
    var producerName = this.state.rowSelection.selectedRowKeys[0];
    stake = new BigNumber(stake * this.state.dposInfo.unitStake).shiftedBy(FT_DECIMALS).toNumber();
    var rlpData = encode([producerName, stake]);
    params.data = '0x' + rlpData.toString('hex');

    try {
      const response = await rpc.sendTransaction(params);
      if (response.status == 200) {
          if (response.data.result != null) {
              saveTxHash(params.accountName, params.actionType, response.data.result);
              Feedback.toast.success("交易发送成功");

              this.onClose();
          } else {
              Feedback.toast.error("交易发送失败:" + response.data.error.message);
          }
      } else {
          Feedback.toast.error("交易发送失败, 错误号:" + response.status);
      }
      return response.data;
    } catch (error) {
        Feedback.toast.error("交易发送失败, 错误信息:" + error);
    }
  }

  onClose = () => {
    this.setState({voteVisible: false, maxStakeTooltip: ''});
  }

  cancelVote = async (e) => {
    if(this.state.rowSelection.selectedRowKeys.length == 0) {
      Feedback.toast.error("请选择需要取消投票的生产者账号");
      return;
    }
    
    if(this.state.myVoteInfoSet[this.state.rowSelection.selectedRowKeys[0]] == null) {
      Feedback.toast.error("您尚未对此生产者投过票，因此无法取消");
      return;
    }  
    this.setState({inputPasswordVisible: true});
  }

  onAccountChange = function (value, option) {
    this.state.voteAccount = option.originValue;
    var accountMaxStake = 0;
    var unitStake = new BigNumber(this.state.dposInfo.unitStake);
    for(let balance of option.originValue.balances) {
      if(balance.assetID == ACTION.FT_ASSET_ID) {
        accountMaxStake = new BigNumber(balance.balance).shiftedBy(ACTION.FT_DECIMALS * -1).dividedBy(unitStake).toFixed(0);
        break;
      }
    }
    this.setState({maxStakeTooltip:'最大可投票数' + accountMaxStake, accountMaxStake});
  };
  renderMyVote = (voteInfos) => {
    if (voteInfos == null) {
      return 0;
    }
    return voteInfos.map((voteInfo) =>
      {
        var defaultTrigger = <Tag type="normal" size="small">{voteInfo.name}:{voteInfo.quantity}</Tag>;
        return <Balloon  trigger={defaultTrigger} closable={false}>我的投票账户:{voteInfo.name}, 投票数:{voteInfo.quantity}</Balloon>;
      }
    );
  }
  handleStakeChange = (v) => {
    this.state.stake = v;
  }
  handlePasswordChange = (v) => {
    this.state.password = v;
  }
  onInputPasswordOK = async (e) => {
    var {value} = this.state;
    if (this.state.voter == null) {
      Feedback.toast.error("请选择投票账户");
      return;
    }

    if (this.state.password == '') {
        Feedback.toast.error("请输入账户所绑定密钥对应的密码");
        return;
    }

    var params = {};
    params.actionType = ACTION.UNVOTE_PRODUCER;
    params.accountName = this.state.voter;
    params.password = this.state.password;

    try {
      const response = await rpc.sendTransaction(params);
      if (response.status == 200) {
          if (response.data.result != null) {
              saveTxHash(params.accountName, params.actionType, response.data.result);
              Feedback.toast.success("交易发送成功");
              this.onInputPasswordClose();
          } else {
              Feedback.toast.error("交易发送失败:" + response.data.error.message);
          }
      } else {
          Feedback.toast.error("交易发送失败, 错误号:" + response.status);
      }
      return response.data;
    } catch (error) {
        Feedback.toast.error("交易发送失败, 错误信息:" + error);
    }
  }
  onInputPasswordClose = () => {
    this.state.voter = null;
    this.setState({inputPasswordVisible: false});
  }

  removeVoter = () => {
    if (this.state.myProducers.length == 0) {
      Feedback.toast.error("您无账号注册过生产者，无法进行此操作");
      return;
    }
    this.setState({removeVoterVisible: true});
  }

  onRemoveVoterClose = () => {
    this.setState({removeVoterVisible: false});
  }

  changeProducer = () => {
    if(this.state.rowSelection.selectedRowKeys.length == 0) {
      Feedback.toast.error("请选择需要新的投票对象");
      return;
    }
    var voters = this.state.myVoteInfoSet[this.state.rowSelection.selectedRowKeys[0]];
    var myRestVoters2Producer = [];
    this.state.myVoterAccounts.map((myVoter) => {
      if (voters == null) {
        myRestVoters2Producer.push({label: myVoter.accountName, value: myVoter.accountName});
        return;
      }
      for (let voter of voters) {
        if (voter.name == myVoter.accountName) {
          return;
        }
      }
      myRestVoters2Producer.push({label: myVoter.accountName, value: myVoter.accountName});
    })
    if (myRestVoters2Producer.length == 0) {
      Feedback.toast.error("您没有可改投的投票账号");
      return;
    }
    this.setState({changeProducerVisible: true, myRestVoters2Producer});
  }
  onChangeProducerOK = async () => {
    var {value} = this.state;
    if (this.state.voter == null) {
      Feedback.toast.error("请选择需要改变投票的账户");
      return;
    }

    if (this.state.password == '') {
        Feedback.toast.error("请输入账户所绑定密钥对应的密码");
        return;
    }

    var params = {};
    params.actionType = ACTION.CHANGE_PRODUCER;
    params.accountName = this.state.voter;
    params.password = this.state.password;

    var producerName = this.state.rowSelection.selectedRowKeys[0];
    var rlpData = encode([producerName]);
    params.data = '0x' + rlpData.toString('hex');

    try {
      const response = await rpc.sendTransaction(params);
      if (response.status == 200) {
          if (response.data.result != null) {
              saveTxHash(params.accountName, params.actionType, response.data.result);
              Feedback.toast.success("交易发送成功");
              this.onChangeProducerClose();
          } else {
              Feedback.toast.error("交易发送失败:" + response.data.error.message);
          }
      } else {
          Feedback.toast.error("交易发送失败, 错误号:" + response.status);
      }
      return response.data;
    } catch (error) {
        Feedback.toast.error("交易发送失败, 错误信息:" + error);
    }
  }
  onChangeProducerClose = () => {
    this.state.voter = null;
    this.setState({changeProducerVisible: false});
  }

  handleVoterChange = (v) => {
    this.state.voterAccountName = v;
  }
  
  onProducerChange = (v) => {
    this.state.producer = v;
  }

  onVoterChange = (v) => {
    this.state.voter = v;
    this.setState({passwordTooltip: v});
  }

  onRemoveVoterOK = async () => {
    if (this.state.producer == null || this.state.producer == '') {
      Feedback.toast.error("请选择生产者");
      return;
    }

    var resp = await rpc.isAccountExist([this.state.voterAccountName]);
    if (resp.data.result == false) {
        Feedback.toast.error("投票账户不存在");
        return;
    }

    if (this.state.password == '') {
      Feedback.toast.error("请输入账户所绑定密钥对应的密码");
      return;
    }

    var params = {};
    params.actionType = ACTION.REMOVE_VOTER;
    params.accountName = this.state.producer.accountName;
    params.password = this.state.password;

    var payload = encode([this.state.voterAccountName]);
    params.data = '0x' + payload.toString('hex');

    try {
      const response = await rpc.sendTransaction(params);
      if (response.status == 200) {
          if (response.data.result != null) {
              saveTxHash(params.accountName, params.actionType, response.data.result);
              Feedback.toast.success("交易发送成功");
              this.onRemoveVoterClose();
          } else {
              Feedback.toast.error("交易发送失败:" + response.data.error.message);
          }
      } else {
          Feedback.toast.error("交易发送失败, 错误号:" + response.status);
      }
      return response.data;
    } catch (error) {
        Feedback.toast.error("交易发送失败, 错误信息:" + error);
    }
  }

  registerProducer = () => {
    if (this.state.otherAccounts.length == 0) {
      Feedback.toast.error("您无账号可以注册为生产者，无法进行此操作");
      return;
    }
    this.setState({registerProducerVisible: true});
  }

  handleURLChange = (v) => {
    this.state.url = v;
  }

  onProducerChange = function (value, option) {
    this.state.producer = option;
    var accountMaxStake = 0;
    var unitStake = new BigNumber(this.state.dposInfo.unitStake);
    for(let balance of option.balances) {
      if(balance.assetID == ACTION.FT_ASSET_ID) {
        accountMaxStake = new BigNumber(balance.balance).shiftedBy(ACTION.FT_DECIMALS * -1).dividedBy(unitStake).toFixed(0);
        break;
      }
    }
    this.setState({maxStakeTooltip:'最大可投票数' + accountMaxStake, accountMaxStake});
  };

  onRegisterProducerOK = async () => {
    if (this.state.producer == null || this.state.producer == '') {
      Feedback.toast.error("请选择待注册为生产者的账号");
      return;
    }
    if (this.state.url == '') {
      Feedback.toast.error("请输入URL");
      return;
    }
    var stake = parseInt(this.state.stake);
    if (new BigNumber(stake).comparedTo(new BigNumber(this.state.dposInfo.producerMinQuantity)) < 0) {
      Feedback.toast.error("给自己的投票数必须大于等于" + this.state.dposInfo.producerMinQuantity);
      return;
    }
    if (new BigNumber(stake).comparedTo(this.state.accountMaxStake) > 0) {
      Feedback.toast.error("已超过最大投票数，无法进行投票");
      return;
    }
    if (this.state.password == '') {
      Feedback.toast.error("请输入账号对应的密码");
      return;
    }
    var params = {};
    params.actionType = ACTION.REG_PRODUCER;
    params.accountName = this.state.producer.accountName;
    params.password = this.state.password;
    
    stake = new BigNumber(stake * this.state.dposInfo.unitStake).shiftedBy(FT_DECIMALS).toNumber();
    var rlpData = encode([this.state.url, stake]);
    params.data = '0x' + rlpData.toString('hex');

    try {
      const response = await rpc.sendTransaction(params);
      if (response.status == 200) {
          if (response.data.result != null) {
              saveTxHash(params.accountName, params.actionType, response.data.result);
              Feedback.toast.success("交易发送成功");

              this.onRegisterProducerClose();
          } else {
              Feedback.toast.error("交易发送失败:" + response.data.error.message);
          }
      } else {
          Feedback.toast.error("交易发送失败, 错误号:" + response.status);
      }
      return response.data;
    } catch (error) {
        Feedback.toast.error("交易发送失败, 错误信息:" + error);
    }
  }
  onRegisterProducerClose = () => {
    this.setState({registerProducerVisible: false});
  }
  updateProducer = () => {
    if (this.state.myProducers.length == 0) {
      Feedback.toast.error("您无账号可以注册为生产者，无法进行此操作");
      return;
    }
    this.setState({updateProducerVisible: true});
  }

  onUpdateProducerClose = () => {
    this.setState({updateProducerVisible: false});
  }
  onUpdateProducerOK = async () => {
    if (this.state.producer == null || this.state.producer == '') {
      Feedback.toast.error("请选择待注销的生产者账号");
      return;
    }
    if (this.state.url == '') {
      Feedback.toast.error("请输入URL");
      return;
    }
    var stake = parseInt(this.state.stake);
    if (new BigNumber(stake).comparedTo(new BigNumber(this.state.dposInfo.producerMinQuantity)) < 0) {
      Feedback.toast.error("给自己的投票数必须大于等于" + this.state.dposInfo.producerMinQuantity);
      return;
    }
    if (new BigNumber(stake).comparedTo(this.state.accountMaxStake) > 0) {
      Feedback.toast.error("已超过最大投票数，无法进行投票");
      return;
    }
    if (this.state.password == '') {
      Feedback.toast.error("请输入账号对应的密码");
      return;
    }
    var params = {};
    params.actionType = ACTION.UPDATE_PRODUCER;
    params.accountName = this.state.producer.accountName;
    params.password = this.state.password;
    
    stake = new BigNumber(stake * this.state.dposInfo.unitStake).shiftedBy(FT_DECIMALS).toNumber();
    var rlpData = encode([this.state.url, stake]);
    params.data = '0x' + rlpData.toString('hex');

    try {
      const response = await rpc.sendTransaction(params);
      if (response.status == 200) {
          if (response.data.result != null) {
              saveTxHash(params.accountName, params.actionType, response.data.result);
              Feedback.toast.success("交易发送成功");

              this.onUpdateProducerClose();
          } else {
              Feedback.toast.error("交易发送失败:" + response.data.error.message);
          }
      } else {
          Feedback.toast.error("交易发送失败, 错误号:" + response.status);
      }
      return response.data;
    } catch (error) {
        Feedback.toast.error("交易发送失败, 错误信息:" + error);
    }
  }

  unRegisterProducer = () => {
    if (this.state.myProducers.length == 0) {
      Feedback.toast.error("您无生产者账号，无法进行此操作");
      return;
    }
    this.setState({unRegisterProducerVisible: true});
  }
  onUnRegisterProducerOK = async () => {
    if (this.state.producer == null || this.state.producer == '') {
      Feedback.toast.error("请选择待注销的生产者账号");
      return;
    }
    if (this.state.password == '') {
      Feedback.toast.error("请输入账号对应的密码");
      return;
    }
    var params = {};
    params.actionType = ACTION.UNREG_PRODUCER;
    params.accountName = this.state.producer.accountName;
    params.password = this.state.password;
    
    try {
      const response = await rpc.sendTransaction(params);
      if (response.status == 200) {
          if (response.data.result != null) {
              saveTxHash(params.accountName, params.actionType, response.data.result);
              Feedback.toast.success("交易发送成功");

              this.onUnRegisterProducerClose();
          } else {
              Feedback.toast.error("交易发送失败:" + response.data.error.message);
          }
      } else {
          Feedback.toast.error("交易发送失败, 错误号:" + response.status);
      }
      return response.data;
    } catch (error) {
        Feedback.toast.error("交易发送失败, 错误信息:" + error);
    }
  }
  onUnRegisterProducerClose = () => {
    this.setState({unRegisterProducerVisible: false});
  }
  nameRender = (value, index, record) => {
    if (record.isMyProducer) {
      return (<div>
              <Icon type="favorites-filling" style={{ color: '#FF3333', marginRight: '10px' }} />
              {value}
             </div>)
    } else {
      return value;
    }
  }
  
  onSort(dataIndex, order) {
    const producerList = this.state.producerList.sort(function(a, b) {
        const result = a[dataIndex] - b[dataIndex];
        return  (order === 'asc') ? (result > 0 ? 1 : -1) : (result > 0 ? -1 : 1);
    });
    this.setState({
        producerList,
    });
}

  render() {
    return (
      <div className="progress-table">
          <p>
            <Button type="primary" onClick={this.vote.bind(this)}>
              投票
            </Button>
            &nbsp;&nbsp;
            <Button type="primary" onClick={this.cancelVote.bind(this)} disabled={this.state.cancelVoteDisable}>
              取消对生产者的投票
            </Button>
            &nbsp;&nbsp;
            <Button type="primary" onClick={this.removeVoter.bind(this)} disabled={!this.state.bMyProducer}>
              取消投票者的投票
            </Button>
            &nbsp;&nbsp;
            <Button type="primary" onClick={this.changeProducer.bind(this)}>
              改投其它生产者
            </Button>
            &nbsp;&nbsp;
            <Button type="primary" onClick={this.registerProducer.bind(this)}>
              注册生产者
            </Button>
            &nbsp;&nbsp;
            <Button type="primary" onClick={this.updateProducer.bind(this)} disabled={!this.state.bMyProducer}>
              更新生产者
            </Button>
            &nbsp;&nbsp;
            <Button type="primary" onClick={this.unRegisterProducer.bind(this)} disabled={!this.state.bMyProducer}>
              注销生产者
            </Button>
          </p> 
          <Table primaryKey='name'
            dataSource={this.state.producerList}
            rowSelection={this.state.rowSelection}
            onSort={this.onSort.bind(this)}
          >
            <Table.Column title="生产者账号" dataIndex="name" width={150} cell={this.nameRender.bind(this)}/>
            <Table.Column title="URL" dataIndex="url" width={150} />
            <Table.Column title="自身投票数" dataIndex="quantity" width={100} sortable/>
            <Table.Column title="总投票数" dataIndex="totalQuantity" width={100}  sortable/>
            <Table.Column title="生效区块高度" dataIndex="height" width={150}  sortable/>
            <Table.Column title="我的投票" dataIndex="myVote" width={200} cell={this.renderMyVote.bind(this)}/>
          </Table>

          <Dialog
            visible={this.state.voteVisible}
            title="投票"
            footerActions={['ok', 'cancel']}
            footerAlign='center'
            closeable='true'
            onOk={this.onVoteOK.bind(this)}
            onCancel={this.onClose.bind(this)}
            onClose={this.onClose.bind(this)}
            >
            <Select
              style={{width: 400}}
              placeholder="选择您可投票的账户"
              onChange={this.onAccountChange.bind(this)}
              dataSource={this.state.canVoteAccounts}
            ></Select>       
            <br />
            <br />
            <Input hasClear
                trim
                placeholder={this.state.maxStakeTooltip}
                onChange={this.handleStakeChange.bind(this)} 
                style={{ width: 400 }}
                addonBefore="投票数"
                size="medium"
                defaultValue=""
                maxLength={20}
                hasLimitHint
                onPressEnter={this.onVoteOK.bind(this)}
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
                onPressEnter={this.onVoteOK.bind(this)}
            />       
          </Dialog> 

          <Dialog
                visible={this.state.inputPasswordVisible}
                title="取消对生产者的投票"
                footerActions='ok'
                footerAlign='center'
                closeable='true'
                onOk={this.onInputPasswordOK.bind(this)}
                onCancel={this.onInputPasswordClose.bind(this)}
                onClose={this.onInputPasswordClose.bind(this)}
                >
                <Select
                  style={{width: 400}}
                  placeholder="选择您的投票账户"
                  onChange={this.onVoterChange.bind(this)}
                  dataSource={this.state.myVoters2Producer}
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
                    onPressEnter={this.onInputPasswordOK.bind(this)}
                    placeholder={this.state.passwordTooltip + "对应的密码"}
                />
            </Dialog> 

            <Dialog
              visible={this.state.removeVoterVisible}
              title="取消投票者的投票"
              footerActions={['ok', 'cancel']}
              footerAlign='center'
              closeable='true'
              onOk={this.onRemoveVoterOK.bind(this)}
              onCancel={this.onRemoveVoterClose.bind(this)}
              onClose={this.onRemoveVoterClose.bind(this)}
              >
              <Select
                style={{width: 400}}
                placeholder="选择您的生产者账户"
                onChange={this.onProducerChange.bind(this)}
                dataSource={this.state.myProducers}
              ></Select>       
              <br />
              <br />
              <Input hasClear
                  onChange={this.handleVoterChange.bind(this)} 
                  style={{ width: 400 }}
                  addonBefore="投票者账户"
                  size="medium"
                  defaultValue=""
                  maxLength={16}
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
                  onPressEnter={this.onRemoveVoterOK.bind(this)}
              />       
            </Dialog> 

            <Dialog
                visible={this.state.changeProducerVisible}
                title="改投其它生产者"
                footerActions='ok'
                footerAlign='center'
                closeable='true'
                onOk={this.onChangeProducerOK.bind(this)}
                onCancel={this.onChangeProducerClose.bind(this)}
                onClose={this.onChangeProducerClose.bind(this)}
                >
                <Select
                  style={{width: 400}}
                  placeholder="选择您的投票账户"
                  onChange={this.onVoterChange.bind(this)}
                  dataSource={this.state.myRestVoters2Producer}
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
                    onPressEnter={this.onChangeProducerOK.bind(this)}
                    placeholder={this.state.passwordTooltip + "对应的密码"}
                />
            </Dialog> 

            <Dialog
              visible={this.state.registerProducerVisible}
              title="注册生产者"
              footerActions={['ok', 'cancel']}
              footerAlign='center'
              closeable='true'
              onOk={this.onRegisterProducerOK.bind(this)}
              onCancel={this.onRegisterProducerClose.bind(this)}
              onClose={this.onRegisterProducerClose.bind(this)}
              >
              <Select
                style={{width: 400}}
                placeholder="选择待注册为生产者的账户"
                onChange={this.onProducerChange.bind(this)}
                dataSource={this.state.otherAccounts}
              ></Select>       
              <br />
              <br />
              <Input hasClear
                onChange={this.handleURLChange.bind(this)} 
                style={{ width: 400 }}
                addonBefore="URL"
                size="medium"
                defaultValue=""
                maxLength={this.state.dposInfo.maxURLLen}
                hasLimitHint
              />    
              <br />
              <br />
              <Input hasClear
                trim
                placeholder={this.state.maxStakeTooltip}
                onChange={this.handleStakeChange.bind(this)} 
                style={{ width: 400 }}
                addonBefore="投票数"
                size="medium"
                defaultValue=""
                maxLength={20}
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
                placeholder=""
                onPressEnter={this.onRegisterProducerOK.bind(this)}
              />       
            </Dialog> 
            <Dialog
              visible={this.state.updateProducerVisible}
              title="更新生产者"
              footerActions={['ok', 'cancel']}
              footerAlign='center'
              closeable='true'
              onOk={this.onUpdateProducerOK.bind(this)}
              onCancel={this.onUpdateProducerClose.bind(this)}
              onClose={this.onUpdateProducerClose.bind(this)}
              >
              <Select
                style={{width: 400}}
                placeholder="选择待更新的生产者账户"
                onChange={this.onProducerChange.bind(this)}
                dataSource={this.state.myProducers}
              ></Select>       
              <br />
              <br />
              <Input hasClear
                onChange={this.handleURLChange.bind(this)} 
                style={{ width: 400 }}
                addonBefore="URL"
                size="medium"
                defaultValue=""
                maxLength={this.state.dposInfo.maxURLLen}
                hasLimitHint
              />    
              <br />
              <br />
              <Input hasClear
                trim
                placeholder={this.state.maxStakeTooltip}
                onChange={this.handleStakeChange.bind(this)} 
                style={{ width: 400 }}
                addonBefore="投票数"
                size="medium"
                defaultValue=""
                maxLength={20}
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
                placeholder=""
                onPressEnter={this.onRegisterProducerOK.bind(this)}
              />       
            </Dialog> 
            <Dialog
              visible={this.state.unRegisterProducerVisible}
              title="注销生产者"
              footerActions={['ok', 'cancel']}
              footerAlign='center'
              closeable='true'
              onOk={this.onUnRegisterProducerOK.bind(this)}
              onCancel={this.onUnRegisterProducerClose.bind(this)}
              onClose={this.onUnRegisterProducerClose.bind(this)}
              >
              <Select
                style={{width: 400}}
                placeholder="选择待注销的生产者账户"
                onChange={this.onProducerChange.bind(this)}
                dataSource={this.state.myProducers}
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
                placeholder=""
                onPressEnter={this.onRegisterProducerOK.bind(this)}
              />       
            </Dialog> 
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