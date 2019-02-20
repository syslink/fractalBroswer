import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table, Button, Input, Dialog, Feedback } from '@icedesign/base';
import CellEditor from './CellEditor';
import './EditableTable.scss';
import axios from 'axios';

export default class EditableTable extends Component {
  static displayName = 'EditableTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    
    this.state = {
      dataSource: [],
      pwdDialogVisible: false,
      newPwdDialogVisible: false,
      importKeyDialogVisible: false,
      msgVisible: false,
      msgType: '',
      msgContent: '',
      method: 'keystore_listAccount',
      extraParam: [],
      password: '',
      newPassword: '',
      publicKey: '',
      privateKey: '',
      path: '',
      successCallback: () => {},
      errCallback: (error) => {
        this.setState({
          pwdDialogVisible: false
        });
        },
    };
  }

  componentDidMount() {
    var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                    "method": this.state.method, 
                                    "params": [],
                                    "id": 1});
    const options = {
      method: 'POST',
      data: dataToSrv,
    };
    var _this = this;
    axios(options).then(function (response) {
          if (response.data.hasOwnProperty("result")) {
            for( let keyValue of response.data.result){
              _this.state.dataSource.push({address: keyValue.address, publicKey: keyValue.publicKey, path: keyValue.path});
            }
            _this.setState({
              dataSource: this.state.dataSource
            });
          } else if (response.data.hasOwnProperty("error")) {
            Feedback.toast.error('无法获取秘钥');
          }
        })
        .catch(function (error) {
          _this.state.errCallback(error); 
        });
  }

  renderOrder = (value, index) => {
    return <span>{index}</span>;
  };

  deleteItem = (index) => {
    this.setState({
      pwdDialogVisible: true,
      method: "keystore_delete",
      extraParam: [this.state.dataSource[index].address],
      successCallback: (response) => {
        this.state.dataSource.splice(index, 1);
      },
    });
  };

  modifyPwd = (index) => {
    var _this = this;
    this.setState({
      newPwdDialogVisible: true,
      method: "keystore_update",
      extraParam: [this.state.dataSource[index].address],
      successCallback: (response) => {
        _this.setState({
          newPwdDialogVisible: false,
        });

        Feedback.toast.success('密码修改成功');
      },
    });
  };

  showPriKey = (index) => {
    var _this = this;
    this.setState({
      pwdDialogVisible: true,
      method: "keystore_exportRawKey",
      extraParam: [this.state.dataSource[index].address],
      successCallback: (response) => {
        _this.setState({
          msgVisible: true,
          msgContent: "私钥:" + response.data.result,
          newPwdDialogVisible: false,
        });
      },
    });
  };

  renderOperation = (value, index) => {
    return (
      <view>
        <Button type="primary" onClick={this.deleteItem.bind(this, index)}>
          删除
        </Button>
        &nbsp;&nbsp;
        <Button type="primary" onClick={this.modifyPwd.bind(this, index)}>
          修改密码
        </Button>
        &nbsp;&nbsp;
        <Button type="primary" onClick={this.showPriKey.bind(this, index)}>
          查看私钥
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

  addNewItem = () => {
    this.setState({
      pwdDialogVisible: true,
      method: "keystore_newAccount",
      extraParam: [],
      successCallback: (response) => {
        console.log(response);
        var {result} = response.data;
        this.state.dataSource.push({address: result.address, publicKey: result.publicKey, path: result.path});
        this.setState({
          dataSource: this.state.dataSource,
          pwdDialogVisible: false
        });
      }
    });
  }

  importPrikey = () => {
    this.setState({
      importKeyDialogVisible: true,
      method: "keystore_importRawKey",
      extraParam: [],
      successCallback: (response) => {
        console.log(response);
        var {result} = response.data;
        this.state.dataSource.push({address: result.address, publicKey: result.publicKey, path: result.path});
        this.setState({
          dataSource: this.state.dataSource,
          importKeyDialogVisible: false
        });
      }
    });
  }

  errMsg = (errInfo) => {
    this.setState({
      msgVisible: true,
      msgType: 'error',
      msgContent: errInfo,
    });
  }

  onOK = () => {
    var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                    "method": this.state.method, 
                                    "params": this.state.extraParam.concat([this.state.password]),
                                    "id": 1});
    const options = {
      method: 'POST',
      data: dataToSrv,
    };
    const _this = this;
    axios(options).then(function (response) {
          if (response.data.hasOwnProperty("result")) {
            _this.state.successCallback(response);
          } else if (response.data.hasOwnProperty("error")) {
            var msg = response.data.error.message;
            if (msg.indexOf("Address") != -1) {
              Feedback.toast.error('地址错误');
            } else if (msg.indexOf("passphrase")) {

              Feedback.toast.error('密码不匹配');
            }
          }
          _this.setState({
            pwdDialogVisible: false,
            newPwdInputVisible: false
          });
         })
         .catch(function (error) {
            _this.state.errCallback(error); 
         });
  };

  onClose = () => {
    this.setState({
      pwdDialogVisible: false
    });
  };

  onMsgClose = () => {
    this.setState({
      msgVisible: false
    });
  };

  onChangePwdOK = () => {
    var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                    "method": this.state.method, 
                                    "params": this.state.extraParam.concat([this.state.password, this.state.newPassword]),
                                    "id": 1});
    const options = {
      method: 'POST',
      data: dataToSrv,
    };
    const _this = this;
    axios(options).then(function (response) {
          if (response.data.hasOwnProperty("result")) {
            _this.state.successCallback(response);
          } else if (response.data.hasOwnProperty("error")) {
            Feedback.toast.error('修改密码失败');
          }
          _this.setState({
            newPwdDialogVisible: false
          });
         })
         .catch(function (error) {
            _this.state.errCallback(error); 
         });
  };

  onChangePwdClose = () => {
    this.setState({
      newPwdDialogVisible: false
    });
  };

  onImportKeyOK = () => {
    var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                    "method": this.state.method, 
                                    "params": this.state.extraParam.concat([this.state.privateKey, this.state.password]),
                                    "id": 1});
    const options = {
      method: 'POST',
      data: dataToSrv,
    };
    const _this = this;
    axios(options).then(function (response) {
          if (response.data.hasOwnProperty("result")) {
            _this.state.successCallback(response);
          } else if (response.data.hasOwnProperty("error")) {
            Feedback.toast.error('导入私钥失败');
          }
          _this.setState({
            importKeyDialogVisible: false
          });
         })
         .catch(function (error) {
            _this.state.errCallback(error); 
         });
  };

  onImportKeyClose = () => {
    this.setState({
      importKeyDialogVisible: false
    });
  };

  handlePasswordChange(v, e) {
    this.state.password = v;
  }

  handleNewPasswordChange(v, e) {
    this.state.newPassword = v;
  }

  handlePrivateKeyChange(v, e) {
    this.state.privateKey = v;
  }

  render() {
    return (
      <div className="editable-table">
        <IceContainer>
          <Table dataSource={this.state.dataSource} hasBorder={false}>
            <Table.Column width={80} title="ID" cell={this.renderOrder} />
            <Table.Column
              width={120}
              title="公钥"
              dataIndex="publicKey"
            />
            <Table.Column
              width={120}
              title="文件路径"
              dataIndex="path"
            />
            <Table.Column title="操作" width={200} cell={this.renderOperation} />
          </Table>
          <div onClick={this.addNewItem} style={styles.addNewItem}>
            + 新增一对公私钥
          </div>
          <div onClick={this.importPrikey} style={styles.addNewItem}>
            + 导入私钥
          </div>
        </IceContainer>
        <Dialog
          visible={this.state.pwdDialogVisible}
          onOk={this.onOK}
          onCancel={this.onClose}
          onClose={this.onClose}
          title="输入密码"
          footerAlign='center'
        >
          <Input hasClear
            htmlType="password"
            onChange={this.handlePasswordChange.bind(this)} 
            style={{ width: 400 }}
            addonBefore="密码"
            size="medium"
            defaultValue=""
            maxLength={20}
            hasLimitHint
            onPressEnter={this.onOK}
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
          visible={this.state.newPwdDialogVisible}
          onOk={this.onChangePwdOK}
          onCancel={this.onChangePwdClose}
          onClose={this.onChangePwdClose}
          title="修改密码"
          footerAlign='center'
        >
          <Input hasClear
            htmlType="password"
            onChange={this.handlePasswordChange.bind(this)} 
            style={{ width: 400 }}
            addonBefore="旧密码"
            size="medium"
            defaultValue=""
            maxLength={20}
            hasLimitHint
            onPressEnter={this.onChangePwdOK}
          />
          <p/>
          <p/>
          <Input hasClear
            htmlType="password"
            onChange={this.handleNewPasswordChange.bind(this)} 
            style={{ width: 400 }}
            addonBefore="新密码"
            size="medium"
            defaultValue=""
            maxLength={20}
            hasLimitHint
            onPressEnter={this.onChangePwdOK}
          />
        </Dialog>  
        <Dialog
          visible={this.state.importKeyDialogVisible}
          onOk={this.onImportKeyOK}
          onCancel={this.onImportKeyClose}
          onClose={this.onImportKeyClose}
          title="导入私钥"
          footerAlign='center'
        >
          <Input hasClear
            onChange={this.handlePrivateKeyChange.bind(this)} 
            style={{ width: 400 }}
            addonBefore="私钥"
            placeholder="无需0x前缀"
            size="medium"
            defaultValue=""
            maxLength={64}
            hasLimitHint
            onPressEnter={this.onImportKeyOK}
          />
          <p/>
          <p/>
          <Input hasClear
            htmlType="password"
            onChange={this.handlePasswordChange.bind(this)} 
            style={{ width: 400 }}
            addonBefore="密码"
            size="medium"
            defaultValue=""
            maxLength={20}
            hasLimitHint
            onPressEnter={this.onImportKeyOK}
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
