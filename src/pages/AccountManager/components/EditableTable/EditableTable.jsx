import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table, Button } from '@icedesign/base';
import CellEditor from './CellEditor';
import './EditableTable.scss';
import { Input, Dialog } from '@icedesign/base';


const generatorData = () => {
  return Array.from({ length: 5 }).map((item, index) => {
    return {
      userName: 'Sam',
      privateKey: '0x223222233',
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
      dataSource: generatorData(),
      visible: false,
      publicKey: '',
      privateKey: '',
      userName: ''
    };
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
  handlePrivateChange(v, e) {
    this.state.privateKey = v;
  }
  handleUserNameChange(v, e) {
    this.state.userName = v;
  }

  render() {
    return (
      <div className="editable-table">
        <IceContainer>
          <Table dataSource={this.state.dataSource} hasBorder={false}>
            <Table.Column width={80} title="ID" cell={this.renderOrder} />
            <Table.Column
              width={280}
              title="用户名"
              cell={this.renderEditor.bind(this, 'userName')}
            />
            <Table.Column
              width={240}
              title="私钥"
              cell={this.renderEditor.bind(this, 'privateKey')}
            />
            <Table.Column
              width={180}
              title="公钥"
              cell={this.renderEditor.bind(this, 'publicKey')}
            />
            <Table.Column title="操作" width={80} cell={this.renderOperation} />
          </Table>
          <div onClick={this.addNewItem} style={styles.addNewItem}>
            + 新增一行
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
            onChange={this.handlePrivateChange.bind(this)} 
            style={{ width: 400 }}
            addonBefore="私钥"
            size="medium"
            defaultValue=""
            maxLength={34}
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
