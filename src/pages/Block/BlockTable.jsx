import React, { Component } from 'react';
import { Search, Grid } from "@icedesign/base";
import IceContainer from '@icedesign/container';

const { Row, Col } = Grid;

export default class BlockTable extends Component {
  static displayName = 'BlockTable';

  constructor(props) {
    super(props);
    this.state = {
        filter: [
            {
              text: "区块高度",
              value: "height"
            },
            {
              text: "区块Hash值",
              value: "hash"
            }
        ],
        value: "",
        blockInfo: {
            height: "0",
            timeStamp: "50 secs ago",
            transactions: "",
            hash: "",
            parentHash: "",
            minedBy: "",
            difficulty: "",
            size: "",
            gasUsed: "",
            gasLimit: "",
            nonce: "",
            logsBloom: "",
            extraData: ""
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
                    placeholder="height/hash"
                    onFilterChange={this.onFilterChange.bind(this)}
                />
            </Col>
          </Row>
        </IceContainer>

        <IceContainer style={styles.container}>
            <h4 style={styles.title}>Block Information</h4>
            <ul style={styles.summary}>
              <li style={styles.item}>
                <span style={styles.label}>Height：</span>
                <span style={styles.value}>
                  {this.state.blockInfo.height}
                </span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>TimeStamp：</span>
                <span style={styles.value}>{this.state.blockInfo.timeStamp}</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Transactions：</span>
                <span style={styles.value}>0.0.1</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Hash：</span>
                <span style={styles.value}>000001</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Parent Hash：</span>
                <span style={styles.value}>淘小宝</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Mined By：</span>
                <span style={styles.value}>2018-08-29 11:28:23</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Difficulty：</span>
                <span style={styles.value}>2018-08-29 11:28:23</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Size：</span>
                <span style={styles.value}>2018-08-29 11:28:23</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Gas Used：</span>
                <span style={styles.value}>2018-08-29 11:28:23</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Gas Limit：</span>
                <span style={styles.value}>2018-08-29 11:28:23</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Nonce：</span>
                <span style={styles.value}>2018-08-29 11:28:23</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Logs Bloom：</span>
                <span style={styles.value}>2018-08-29 11:28:23</span>
              </li>
              <li style={styles.item}>
                <span style={styles.label}>Extra Data：</span>
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