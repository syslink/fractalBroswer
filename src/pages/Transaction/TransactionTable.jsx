import React, { Component } from 'react';
import { Search, Grid } from "@icedesign/base";
import IceContainer from '@icedesign/container';

const { Row, Col } = Grid;

export default class TransactionTable extends Component {
  static displayName = 'TransactionTable';

  constructor(props) {
    super(props);
    this.state = {
        value: "",
        blockInfo: {
            txhash: "0",
            txReceiptStatus:"",
            blockHeight:0,
            timeStamp: "50 secs ago",
            from: "",
            inputs: "",
            outputs: "",
            tokenTransfered: "",
            value: "",
            gasUsedByTx: "",
            gasPrice: "",
            gasUsed: "",
            gasLimit: "",
            actualTxCost: "",
            nonce: "",
            inputData: ""
        }
    };
  }

  onSearch(value) {
    console.log(value);
  }

  onChange(value) {
    console.log(`input is: ${value}`);

    this.setState({
      value: value
    });
  }

  // value为filter的值，obj为search的全量值
  onFilterChange(value, obj) {
        console.log(`filter is: ${value}`);
        console.log("fullData: ", obj);
  }


  render() {
    return (
      <div>
        <IceContainer>
          <Row style={{ justifyContent: 'center' }}>
            <Col span="24" s="10" l="10">
                <Search
                    size="large"
                    autoWidth="true"
                    onChange={this.onChange.bind(this)}
                    onSearch={this.onSearch.bind(this)}
                    placeholder="tx hash"
                    onFilterChange={this.onFilterChange.bind(this)}
                />
            </Col>
          </Row>
        </IceContainer>

        <IceContainer style={styles.container}>
            <h4 style={styles.title}>Transaction Information</h4>
            <ul style={styles.summary}>
              <li style={styles.item}>
                <span style={styles.label}>TxHash:</span>
                <span style={styles.value}>
                  {this.state.blockInfo.txhash}
                </span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>TxReceipt Status:</span>
                <span style={styles.value}>{this.state.blockInfo.txReceiptStatus}</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Block Height:</span>
                <span style={styles.value}>0.0.1</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Block Hash:</span>
                <span style={styles.value}>0.0.1</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>TimeStamp:</span>
                <span style={styles.value}>000001</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>From:</span>
                <span style={styles.value}>淘小宝</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Inputs:</span>
                <span style={styles.value}>2018-08-29 11:28:23</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Outputs:</span>
                <span style={styles.value}>2018-08-29 11:28:23</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Tokens Transfered:</span>
                <span style={styles.value}>2018-08-29 11:28:23</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Value:</span>
                <span style={styles.value}>2018-08-29 11:28:23</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Gas Used By Transaction：</span>
                <span style={styles.value}>2018-08-29 11:28:23</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Gas Limit：</span>
                <span style={styles.value}>2018-08-29 11:28:23</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Gas Price:</span>
                <span style={styles.value}>2018-08-29 11:28:23</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Actual Tx Cost/Fee:</span>
                <span style={styles.value}>2018-08-29 11:28:23</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Nonce：</span>
                <span style={styles.value}>2018-08-29 11:28:23</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Input Data：</span>
                <span style={styles.value}>2018-08-29 11:28:23</span>
              </li>
            </ul>
          </IceContainer>
      </div>
    );
  }
}

const styles = {
    container: {
      margin: '0',
      padding: '0',
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
    summary: {
      padding: '20px',
    },
    item: {
      height: '32px',
      lineHeight: '32px',
    },
    label: {
      display: 'inline-block',
      fontWeight: '500',
      minWidth: '74px',
    },
  };