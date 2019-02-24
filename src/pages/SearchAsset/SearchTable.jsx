import React, { Component } from 'react';
import { Table, Pagination, Search, Grid, Feedback } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import TableFilter from './TableFilter';
import {getAccountInfo, getAssetInfo} from '../../api'
import BigNumber from "bignumber.js"
const { Row, Col } = Grid;

const getData = () => {
  return Array.from({ length: 10 }).map((item, index) => {
    return {
      assetId: `${index}`,
      assetType: '点击事件',
      assetName: `1000${index}`,
      assetBalance: `986262${index}`
    };
  });
};

export default class SearchTable extends Component {
  static displayName = 'SearchTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      assetInfos: {},
      balanceInfos: [],
      balanceInfosOnePage: [],
      onePageNum: 10,
      assetInfo: [],
    };
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

  onSearch = async (value) => {
    this.state.balanceInfos = [];
    var response = await getAccountInfo([value.key]);
    if (response.data.hasOwnProperty("result") && response.data.result != null) {
      var assetBalances = response.data.result.balances;
      for (let assetBalance of assetBalances) {
        var resp = await getAssetInfo([assetBalance.assetID]);
        this.state.assetInfos[assetBalance.assetID] = resp.data.result;
        var readableValue = this.getReadableNumber(assetBalance.balance, assetBalance.assetID);
        assetBalance.balance = readableValue + ' ' + resp.data.result.symbol + '    [' + assetBalance.balance + ']';
        this.state.balanceInfos.push(assetBalance);
      }
      this.setState({
        balanceInfos: this.state.balanceInfos,
        balanceInfosOnePage: this.state.balanceInfos.slice(0, this.state.onePageNum),
      });
    } if (response.data.hasOwnProperty("result") && response.data.result == null) {
      Feedback.toast.error('无此账户信息');
    } else if (response.data.hasOwnProperty("error")) {
      Feedback.toast.error(response.data.error.message);
    }
  }

  onChange = (currentPage) => {
    var startNo = (currentPage - 1) * this.state.onePageNum;
    var balanceInfos = this.state.balanceInfos.slice(startNo, startNo + this.state.onePageNum);
    this.setState({
      balanceInfosOnePage: balanceInfos,
    });
  }
  onAssetSearch = async (value) => {
    var assetId = value.key;
    if (this.state.assetInfos[assetId] != undefined) {
      this.setState({assetInfo: [this.state.assetInfos[assetId]]});
    } else {
      var resp = await getAssetInfo([parseInt(assetId)]);
      if (resp.data.hasOwnProperty("result") && resp.data.result != null) {
        this.setState({assetInfo: [resp.data.result]});
      } if (resp.data.hasOwnProperty("result") && resp.data.result == null) {
        Feedback.toast.error('无此资产信息');
      } else if (resp.data.hasOwnProperty("error")) {
        Feedback.toast.error(resp.data.error.message);
      }
    }
  }
  render() {
    return (
      <div>
        <IceContainer style={styles.container}>
          <h4 style={styles.title}>用户资产信息</h4>
          <IceContainer>
            <Row style={{ justifyContent: 'center' }}>
              <Col span="24" s="10" l="10">
                  <Search
                      size="large"
                      autoWidth="true"
                      onSearch={this.onSearch.bind(this)}
                      placeholder="用户账号"
                  />
              </Col>
            </Row>
          </IceContainer>

          <IceContainer>
            <Table
              dataSource={this.state.balanceInfosOnePage}
              hasBorder={false}
              style={{ padding: '0 20px 20px' }}
            >
              <Table.Column title="资产ID" dataIndex="assetID" width={50}/>
              <Table.Column title="金额" dataIndex="balance" width={200}/>
            </Table>
            <Pagination
              style={styles.pagination}
              onChange={this.handlePaginationChange}
              total={this.state.balanceInfos.length}
            />
          </IceContainer>
        </IceContainer>

        <IceContainer style={styles.container}>
          <h4 style={styles.title}>资产发行信息</h4>
          <IceContainer>
            <Row style={{ justifyContent: 'center' }}>
              <Col span="24" s="10" l="10">
                  <Search
                      size="large"
                      autoWidth="true"
                      onSearch={this.onAssetSearch.bind(this)}
                      placeholder="资产ID"
                  />
              </Col>
            </Row>
          </IceContainer>

          <IceContainer>
            <Table
              dataSource={this.state.assetInfo}
              hasBorder={false}
              style={{ padding: '0 20px 20px' }}
            >
              <Table.Column title="资产ID" dataIndex="assetid" width={50}/>
              <Table.Column title="名称" dataIndex="assetname" width={50}/>
              <Table.Column title="符号" dataIndex="symbol" width={50}/>
              <Table.Column title="已发行量" dataIndex="amount" width={50}/>
              <Table.Column title="精度" dataIndex="decimals" width={50}/>
              <Table.Column title="创建人" dataIndex="founder" width={50}/>
              <Table.Column title="管理者" dataIndex="owner" width={50}/>
              <Table.Column title="增发量" dataIndex="AddIssue" width={50}/>
              <Table.Column title="资产上限" dataIndex="UpperLimit" width={50}/>
            </Table>
          </IceContainer>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  container: {
    margin: '20px',
    padding: '0 0 20px',
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
  link: {
    margin: '0 5px',
    color: 'rgba(49, 128, 253, 0.65)',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  separator: {
    margin: '0 8px',
    display: 'inline-block',
    height: '12px',
    width: '1px',
    verticalAlign: 'middle',
    background: '#e8e8e8',
  },
  pagination: {
    textAlign: 'right',
    marginRight: '20px',
  },
};
