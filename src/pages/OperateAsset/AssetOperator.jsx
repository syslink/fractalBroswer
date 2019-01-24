import React, { Component } from 'react';
import { Card, Radio, Input } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import AssetIssueTable from './AssetIssueTable'
import AssetIncrease from './AssetIncrease'
import NewOwnerSet from './NewOwnerSet'
import AssetTransfer from './AssetTransfer'

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

export default class AssetOperator extends Component {
  static displayName = 'SearchTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      assetTypeValue: 0
    };
  }

  render() {
    
    return (
      <IceContainer style={styles.container}>
        <h4 style={styles.title}>Asset Operator</h4>
        <Card
          style={styles.card}
          title="Issue Asset"
          language="en-us"
          bodyHeight="325"
        >
          <AssetIssueTable />
        </Card>

        <Card
          style={styles.card}
          title="Increase Asset"
          language="en-us"
          bodyHeight="325"
        >
          <AssetIncrease />
        </Card>

        <Card
          style={styles.card}
          title="Set New Onwer"
          language="en-us"
          bodyHeight="325"
        >
          <NewOwnerSet />
        </Card>

        <Card
          style={styles.card}
          title="Transfer Asset"
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
