import React, { Component } from 'react';
import { Select, Card, Radio, Input } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import AssetIssueTable from './AssetIssueTable'
import AssetIncrease from './AssetIncrease'
import NewOwnerSet from './NewOwnerSet'
import AssetTransfer from './AssetTransfer'
import { getBoundInfo } from '../../api'

export default class AssetOperator extends Component {
  static displayName = 'SearchTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      assetTypeValue: 0,
      accountNames:[],
      selectedAccountName: '',
      password:''
    };
    var _this = this;
    getBoundInfo([]).then(response => {
      if (response.data.hasOwnProperty("result")) {
        if (response.data.result != undefined) {
          var accountNames = [];
          for (let account of response.data.result) {
            accountNames.push(account.accountName);
          }
          _this.setState({accountNames: accountNames});
        }
      }
    });
  }
  onChangeAccount = (value) => {
    this.setState({selectedAccountName: value});
  }
  handlePasswordChange = (value) => {
    this.setState({password: value});
  }
  render() {
    
    return (
      <IceContainer style={styles.container}>
        <h4 style={styles.title}>资产操作</h4>
        <IceContainer style={styles.subContainer}>
          <Select
            style={{width: 400}}
            placeholder="选择您拥有的账户"
            onChange={this.onChangeAccount.bind(this)}
            dataSource={this.state.accountNames}
          ></Select>
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
        </IceContainer>
        <Card
          style={styles.card}
          title="发行资产"
          language="en-us"
          bodyHeight="325"
        >
          <AssetIssueTable accountName={this.state.selectedAccountName} password={this.state.password}/>
        </Card>

        <Card
          style={styles.card}
          title="增发资产"
          language="en-us"
          bodyHeight="325"
        >
          <AssetIncrease />
        </Card>

        <Card
          style={styles.card}
          title="设置资产管理者"
          language="en-us"
          bodyHeight="325"
        >
          <NewOwnerSet />
        </Card>

        <Card
          style={styles.card}
          title="设置资产创建者"
          language="en-us"
          bodyHeight="325"
        >
          <AssetTransfer />
        </Card>

        <Card
          style={styles.card}
          title="销毁资产"
          language="en-us"
          bodyHeight="325"
        >
          <AssetTransfer />
        </Card>
      </IceContainer>
    );
  }
}

const styles = {
  container: {
    margin: '20px',
    padding: '20px 50px',
  },
  subContainer: {
    display: 'flex',
  },
  title: {
    margin: '0',
    padding: '15px 20px',
    fonSize: '16px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    color: 'rgba(0,0,0,.85)',
    fontWeight: '500',
    borderBottom: '1px solid #eee',
  },
  card: {
    width: 400,
    displayName: 'flex',
    marginBottom: '20px',
    marginLeft: '10px',
    marginRight: '10px',
    background: '#fff',
    borderRadius: '6px',
  },
};