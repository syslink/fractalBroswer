import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table, Button, Select } from '@icedesign/base';
import CellEditor from './CellEditor';
import './EditableTable.scss';
import { Input, Dialog, Feedback } from '@icedesign/base';

import injectReducer from '../../../../utils/injectReducer';
import { bindAccountAddr, deleteBoundInfo, updateBoundInfo, 
         getBoundInfo, getKeystore, createAccountBySystem, getAccountInfo } from '../../actions';
import reducer from '../../reducer';

import { connect } from 'react-redux';
import { compose } from 'redux';

const {AutoComplete} = Select;

const generatorData = () => {
  return Array.from({ length: 5 }).map((item, index) => {
    return {
      account: 'Sam',
      address: '0x223222233',
    };
  });
};

class EditableTable extends Component {
  static displayName = 'EditableTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      visible: false,
      creator: '',
      account: '',
      accountReg: new RegExp("^[a-z0-9]{8,16}$"),
      publicKey: '',
      email: '',
      emailReg: new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"),
      systemAccount: "ftsystemio",
      emailDisable: false,
      password: '',
      passwordDisable: false,
      addresses: [],
      successCallback: () => {},
      errCallback: (error) => {},
    };
  }

  componentDidMount() {
    this.props.getKeystore([]);
  }

  renderOrder = (value, index) => {
    return <span>{index}</span>;
  };

  deleteItem = (index) => {
    this.state.dataSource.splice(index, 1);
    this.setState({
      dataSource: this.state.dataSource,
    });
  };

  renderOperation = (value, index) => {
    return (
      <Button onClick={this.deleteItem.bind(this, index)} shape="text">
        删除
      </Button>
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

  addNewItem = () => {

    for( let keyValue of this.props.keystoreInfo){
      this.props.getBoundInfo([keyValue.address]);
    }

    this.setState({
      visible: true
    });
  }

  onOK = () => {
    if (this.state.creator == '') {
      Feedback.toast.error("请选择创建者账号");
      return;
    }
    if (!this.state.accountReg.test(this.state.account)) {
      Feedback.toast.error("账号格式错误");
      return;
    }
    if (this.state.publicKey == '') {
      Feedback.toast.error("请选择公钥");
      return;
    }
    if (!this.state.emailReg.test(this.state.email)) {
      Feedback.toast.error("邮箱格式错误");
      return;
    }
    if (this.state.creator == this.state.systemAccount) {
      this.props.createAccountBySystem({account:this.state.account, publicKey:this.state.publicKey, email:this.state.email});
    } else {

    }
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };
  handlePasswordChange(v, e) {
    this.state.password = v;
  }

  handlePublicKeyChange(v, e) {
    this.state.publicKey = v;
  }
  handleEmailChange(v, e) {
    this.state.email = v;
  }
  handleAccountNameChange(v, e) {
    this.state.account = v;
  }

  onChangeCreatorAccount(value) {
    if (value == this.state.systemAccount) {
      this.setState({
        emailDisable: false,
        passwordDisable: true,
        creator: value,
      });
    } else {
      this.setState({
        emailDisable: true,
        passwordDisable: false,
        creator: value,
      });
    }
  }

  render() {
    return (
      <div className="editable-table">
        <IceContainer>
          <Table dataSource={this.state.dataSource} hasBorder={false} isLoading={this.props.isLoading}>
            <Table.Column width={80} title="ID" cell={this.renderOrder} />
            <Table.Column
              width={200}
              title="账号"
              dataIndex='account'
            />
            <Table.Column
              width={200}
              title="绑定的公钥"
              dataIndex='publicKey'
            />
            <Table.Column title="操作" width={80} cell={this.renderOperation} />
          </Table>
          <div onClick={this.addNewItem.bind(this)} style={styles.addNewItem}>
            + 新增账户
          </div>
        </IceContainer>
        <Dialog
          visible={this.state.visible}
          onOk={this.onOK}
          onCancel={this.onClose}
          onClose={this.onClose}
          title="账户创建"
          footerAlign='center'
        >
          
          <Select
            style={{width: 400}}
            placeholder="选择创建者账户"
            onChange={this.onChangeCreatorAccount.bind(this)}
            dataSource={this.props.accounts}
            label='创建者账号：'
          ></Select>
          <br />
          <br />
          <Input hasClear
            onChange={this.handleAccountNameChange.bind(this)} 
            style={{ width: 400 }}
            addonBefore="账号"
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
            placeholder="选择公钥，此公钥将同账号绑定，后期也可更换"
            onChange={this.handlePublicKeyChange.bind(this)}
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
            disabled={this.state.emailDisable}
            style={{ width: 400 }}
            addonBefore="邮箱"
            size="medium"
            defaultValue=""
            maxLength={34}
            hasLimitHint
          />
          <br />
          <br />
          <Input hasClear
            htmlType="password"
            onChange={this.handlePasswordChange.bind(this)} 
            disabled={this.state.passwordDisable}
            style={{ width: 400 }}
            addonBefore="密码"
            size="medium"
            defaultValue=""
            maxLength={20}
            hasLimitHint
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
  getAccountInfo
};

// 参数state就是redux提供的全局store，而keystoreInfo会成为本组件的this.props的其中一个成员
const mapStateToProps = (state) => {
  return { 
    keystoreInfo: state.accountManager.keystoreInfo,
    accounts: state.accountManager.accountNames,
    isLoading: state.accountManager.isLoading,
    createAccountResult: state.accountManager.createAccountResult,
    accountInfo: state.accountManager.accountInfo,
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
