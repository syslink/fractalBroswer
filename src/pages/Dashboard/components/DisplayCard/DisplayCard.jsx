/* eslint react/jsx-no-target-blank: 0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Balloon, Grid } from '@icedesign/base';
import './DisplayCard.scss';
import DataBinder from '@icedesign/data-binder';

const { Row, Col } = Grid;

export default class extends Component {
  static displayName = '';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
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
              Last Block
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
                  View List Of Blocks
                </Balloon>
              </span>
            </div>
            <div className="count" style={styles.count}>
              46,657
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
                  The Lastest Block No
                </Balloon>
              </span>
            </div>
          </Col>
          <Col xxs="24" s="12" l="6" style={styles.item}>
            <div style={styles.title} className="title">
              Transactions
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
                  View List Of Transacations
                </Balloon>
              </span>
            </div>
            <div style={styles.count} className="count">
              533 M (560 TPS)
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
                  Total Transactions Counter(Update Every 5 Minute)
                </Balloon>
              </span>
            </div>
          </Col>
          <Col xxs="24" s="12" l="6" style={styles.item}>
            <div style={styles.title} className="title">
              Hash Rate
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
                  View Hash Rate Chart
                </Balloon>
              </span>
            </div>
            <div style={styles.count} className="count">
              2,233,000 GH/s
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
                  Avg Hash Rate (The Last 12 Hours)
                </Balloon>
              </span>
              <s></s>
            </div>
          </Col>
          <Col xxs="24" s="12" l="6" style={styles.item}>
            <div style={styles.title} className="title">
              Network Difficulty
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
                  View Difficulty Growth Chart
                </Balloon>
              </span>
            </div>
            <div style={styles.count} className="count">
             3,008.18 TH
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
                  Avg Difficulty
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
