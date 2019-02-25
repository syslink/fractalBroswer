/* eslint react/jsx-no-target-blank: 0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Balloon, Grid } from '@icedesign/base';
import './DisplayCard.scss';
import injectReducer from '../../../../utils/injectReducer';
import { getLatestBlock, getTransactionsNum } from './actions';
import reducer from './reducer';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {  getCurrentBlock, getBlockByHash, getBlockByNum,
          getTransactionByHash, getTransactionReceipt, 
          getTxNumByBlockHash, getTxNumByBlockNum,
          getTotalTxNumByBlockHash, getTotalTxNumByBlockNum,
          getProducers, getDposAccountInfo, getDposIrreversibleInfo,
          getValidateEpchoInfo, getLatestEpchoInfo} from '../../../../api';
import eventProxy from '../../../../utils/eventProxy';
const { Row, Col } = Grid;

class BlockTxLayout extends Component {
  static displayName = '';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      curBlockInfo: {},
      dposInfo: {},
      latestEpchoInfo: {},
      irreversible: {},
      blockDataSource: [],
      txDataSource: [],
      curProducerList: [],
      activeProducers: [],
      totalTxNumInOneHour: 0,
      maxTPS: 0,
      txNums: [],
      txInfos: [],
    };
  }

  componentDidMount() {
    this.updateBlockChainInfo();
  }

  updateBlockChainInfo = async () => {
    var resp = await getCurrentBlock([false]);
    var curBlockInfo = resp.data.result; 
    var curHeight = curBlockInfo.number;

    eventProxy.trigger('curHeight', curHeight);

    resp = await getDposIrreversibleInfo();
    var irreversibleInfo = resp.data.result;

    resp = await getLatestEpchoInfo();
    var latestEpchoInfo = resp.data.result;
    
    resp = await getProducers();
    var producers = resp.data.result;

    var blockInterval = 3;
    var intervalTime = 5 * 60; // 5 minutes, 100 blocks
    var interval = intervalTime / 3;
    var oneHour = 3600;
    var maxSpan = oneHour / blockInterval;
    //var txNums = this.caculateTxNums(curHeight, intervalTime / blockInterval, oneHour / blockInterval);

    var lastMaxHeight = 0;
    if (this.state.txInfos.length > 0) {
      lastMaxHeight = this.state.txInfos[this.state.txInfos.length - 1].blockHeight;
    }
    var totalNum = 0;
    var maxTxNum = 0;
    for (var fromHeigth = curHeight - maxSpan + interval; fromHeigth <= curHeight;) {
      if (fromHeigth <= lastMaxHeight) {
        fromHeigth = fromHeigth + interval;
        continue;
      }
      var resp = await getTotalTxNumByBlockNum([fromHeigth, interval]);
      var txNum = resp.data.result;
      this.state.txInfos.push({blockHeight:fromHeigth, txNum:txNum});
      totalNum += txNum;
      if (txNum > maxTxNum) {
        maxTxNum = txNum;
      }
      fromHeigth = fromHeigth + interval;
    }
    eventProxy.trigger('txInfos', this.state.txInfos);
    this.setState({
      curBlockInfo: curBlockInfo,
      irreversible: irreversibleInfo,
      totalTxNumInOneHour: totalNum,
      maxTPS: Math.round(maxTxNum / intervalTime),
      latestEpchoInfo: latestEpchoInfo,
      curProducerList: producers,
      activeProducers: latestEpchoInfo.ActivatedProducerSchedule,
    });

    setTimeout(() => {this.updateBlockChainInfo()}, 3000);
  }

  caculateTxNums = async (curHeight, interval, maxSpan) => {
    var txNums = [];
    var totalNum = 0;
    var maxTxNum = 0;
    for (var from = curHeight; from > curHeight - maxSpan + interval;) {
      var resp = await getTotalTxNumByBlockNum([from, interval]);
      var txNum = resp.data.result;
      txNums.push(txNum);
      totalNum += txNum;
      if (txNum > maxTxNum) {
        maxTxNum = txNum;
      }
      from = from - interval;
    }
    //var txNumsInfo = [maxTxNum, ...txNums];
    return {txNums, totalNum, maxTxNum};
  }

  render() {
    const down = (
      <img
        src={require('./images/TB1ReMsh3vD8KJjy0FlXXagBFXa-12-18.png')}
        style={styles.down}
        alt=""
      />
    );
    const up = (
      <img
        src={require('./images/TB1Q1Msh3vD8KJjy0FlXXagBFXa-12-18.png')}
        style={styles.up}
        alt=""
      />
    );

    return (
      <IceContainer className="display-card-container" style={styles.container}>
        <Row wrap>
          <Col xxs="24" s="12" l="6" style={styles.item}>
            <div style={styles.title} className="title">
              最新区块
            </div>
            <div className="count" style={styles.count}>
              {this.state.curBlockInfo.number}
              <span style={styles.extraIcon}>
                <Balloon
                  trigger={
                    <img
                      src={require('./images/TB1mfqwXFuWBuNjSszbXXcS7FXa-36-36.png')}
                      alt=""
                      width="12"
                      height="12"
                    />
                  }
                  triggerType="hover"
                  closable={false}
                >
                  最新区块高度
                </Balloon>
              </span>
            </div>
            <div className="count" style={styles.smallCount}>
              {this.state.irreversible.ProposedIrreversible}
              <span style={styles.extraIcon}>
                <Balloon
                  trigger={
                    <img
                      src={require('./images/TB1mfqwXFuWBuNjSszbXXcS7FXa-36-36.png')}
                      alt=""
                      width="12"
                      height="12"
                    />
                  }
                  triggerType="hover"
                  closable={false}
                >
                  不可逆区块高度
                </Balloon>
              </span>
            </div>
          </Col>
          <Col xxs="24" s="12" l="6" style={styles.item}>
            <div style={styles.title} className="title">
              交易信息
            </div>
            <div style={styles.count} className="count">
              {this.state.maxTPS} TPS
              <span style={styles.extraIcon}>
                <Balloon
                  trigger={
                    <img
                      src={require('./images/TB1mfqwXFuWBuNjSszbXXcS7FXa-36-36.png')}
                      alt=""
                      width="12"
                      height="12"
                    />
                  }
                  triggerType="hover"
                  closable={false}
                >
                  一小时内最高TPS
                </Balloon>
              </span>
            </div>
            <div style={styles.smallCount} className="count">
              {this.state.totalTxNumInOneHour} Txns 
              <span style={styles.extraIcon}>
                <Balloon
                  trigger={
                    <img
                      src={require('./images/TB1mfqwXFuWBuNjSszbXXcS7FXa-36-36.png')}
                      alt=""
                      width="12"
                      height="12"
                    />
                  }
                  triggerType="hover"
                  closable={false}
                >
                 最近一小时交易数
                </Balloon>
              </span>
            </div>
          </Col>
          <Col xxs="24" s="12" l="6" style={styles.item}>
            <div style={styles.title} className="title">
              生产者
            </div>
            <div style={styles.count} className="count">
              {this.state.curProducerList.length}
              <span style={styles.extraIcon}>
                <Balloon
                  trigger={
                    <img
                      src={require('./images/TB1mfqwXFuWBuNjSszbXXcS7FXa-36-36.png')}
                      alt=""
                      width="12"
                      height="12"
                    />
                  }
                  triggerType="hover"
                  closable={false}
                >
                  注册为生产者的节点数量
                </Balloon>
              </span>
              <s></s>
            </div>
            <div style={styles.smallCount} className="count">
              {this.state.activeProducers.length} 
              <span style={styles.extraIcon}>
                <Balloon
                  trigger={
                    <img
                      src={require('./images/TB1mfqwXFuWBuNjSszbXXcS7FXa-36-36.png')}
                      alt=""
                      width="12"
                      height="12"
                    />
                  }
                  triggerType="hover"
                  closable={false}
                >
                 出块节点数量
                </Balloon>
              </span>
            </div>
          </Col>
          <Col xxs="24" s="12" l="6" style={styles.item}>
            <div style={styles.title} className="title">
              投票数
            </div>
            <div style={styles.count} className="count">
             {this.state.latestEpchoInfo.TotalQuantity} FT
             <span style={styles.extraIcon}>
                <Balloon
                  trigger={
                    <img
                      src={require('./images/TB1mfqwXFuWBuNjSszbXXcS7FXa-36-36.png')}
                      alt=""
                      width="12"
                      height="12"
                    />
                  }
                  triggerType="hover"
                  closable={false}
                >
                  总投出的票数
                </Balloon>
              </span>
            </div>
            <div style={styles.smallCount} className="count">
              {this.state.latestEpchoInfo.ActivatedTotalQuantity} FT
              <span style={styles.extraIcon}>
                <Balloon
                  trigger={
                    <img
                      src={require('./images/TB1mfqwXFuWBuNjSszbXXcS7FXa-36-36.png')}
                      alt=""
                      width="12"
                      height="12"
                    />
                  }
                  triggerType="hover"
                  closable={false}
                >
                 出块节点获得的总票数
                </Balloon>
              </span>
            </div>
          </Col>
        </Row>
      </IceContainer>
    );
  }
}

const styles = {
  container: {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '10px 0',
  },
  title: {
    fontSize: '12px',
    marginBottom: '5px',
  },
  count: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '3px',
  },
  smallCount: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '3px',
  },
  desc: {
    fontSize: '12px',
  },
  down: {
    width: '6px',
    height: '9px',
  },
  up: {
    width: '6px',
    height: '9px',
  },
  extraIcon: {
    marginLeft: '5px',
    position: 'relative',
    top: '1px',
  },
};


const mapDispatchToProps = {
  getLatestBlock,
  getTransactionsNum
};

// 参数state就是redux提供的全局store，而loginResult会成为本组件的this.props的其中一个成员
const mapStateToProps = (state) => {
  return { lastBlockInfo: state.lastBlockInfo };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'blockTxLayout', reducer });

export default compose(
  withReducer,
  withConnect
)(BlockTxLayout);
