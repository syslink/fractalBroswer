import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table, Button, Select } from '@icedesign/base';
import CellEditor from './CellEditor';
import './EditableTable.scss';
import { Input, Dialog } from '@icedesign/base';


const generatorData = () => {
  return Array.from({ length: 5 }).map((item, index) => {
    return {
      account: 'Sam',
      email: 'test@138.com',
      publicKey: '0x223222233',
    };
  });
};

export default class EditableTable extends Component {
  static displayName = 'EditableTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
      visible: false,
      publicKey: '',
      email: '',
      account: '',
      accounts: ["systemio"],
      addresses: [],
      successCallback: () => {},
      errCallback: (error) => {},
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
      url: this.state.localNodeUrl,
    };
    var _this = this;
    axios(options).then(function (response) {
          if (response.data.hasOwnProperty("result")) {
            for( let keyValue of response.data.result){
              _this.state.addresses.push(keyValue.address);
            }
            _this.setState({
              addresses: this.state.addresses
            });
          } else if (response.data.hasOwnProperty("error")) {
            _this.setState({
              msgVisible: true,
              msgContent: "无法在本地获取公私信息",
            });
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
    this.setState({
      visible: true
    });
  }

  onOK = () => {
    this.state.dataSource.push({
      publicKey: this.state.publicKey,
      privateKey: this.state.privateKey,
      userName: this.state.userName,
    });

    this.setState({
      dataSource: this.state.dataSource,
      visible: false
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  handlePublicChange(v, e) {
    this.state.publicKey = v;
  }
  handleEmailChange(v, e) {
    this.state.email = v;
  }
  handleUserNameChange(v, e) {
    this.state.account = v;
  }

  render() {
    return (
      <div className="editable-table">
        <IceContainer>
          <Table dataSource={this.state.dataSource} hasBorder={false}>
            <Table.Column width={80} title="ID" cell={this.renderOrder} />
            <Table.Column
              width={200}
              title="账号"
              dataIndex='account'
            />
            <Table.Column
              width={200}
              title="绑定的公钥"
              dataIndex='address'
            />
            <Table.Column title="操作" width={80} cell={this.renderOperation} />
          </Table>
          <div onClick={this.addNewItem} style={styles.addNewItem}>
            + 新增账户
          </div>
        </IceContainer>
        <Dialog
          visible={this.state.visible}
          onOk={this.onOK}
          onCancel={this.onClose}
          onClose={this.onClose}
          title="请输入账户信息"
          footerAlign='center'
        >
          <Select
            placeholder="选择创建账户"
            onChange={this.onSelect.bind(this, "creatorAccount")}
            dataSource={this.state.accounts}
          ></Select>

          <Input hasClear
            onChange={this.handleUserNameChange.bind(this)} 
            style={{ width: 400 }}
            addonBefore="用户名"
            size="medium"
            defaultValue=""
            maxLength={10}
            hasLimitHint
          />
          <br />
          <br />
          <Input hasClear
            onChange={this.handlePublicChange.bind(this)} 
            style={{ width: 400 }}
            addonBefore="公钥"
            size="medium"
            defaultValue=""
            maxLength={22}
            hasLimitHint
          />
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
