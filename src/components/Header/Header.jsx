/* eslint jsx-a11y/no-noninteractive-element-interactions:0 */
import React, { PureComponent } from 'react';
import { Balloon, Icon, Input, Dialog, Feedback, Search } from '@icedesign/base';
import IceImg from '@icedesign/img';
import Layout from '@icedesign/layout';
import Menu from '@icedesign/menu';
import FoundationSymbol from 'foundation-symbol';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { headerMenuConfig } from '../../menuConfig';
import Logo from '../Logo';
import { Tag, Button } from '@alifd/next';
import cookie from 'react-cookies'
import axios from 'axios';

export default class Header extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
        nodeConfigVisible: false,
        ip: '127.0.0.1',
        port: 8545
    };
  }
  openSetDialog = () => {
    this.setState({nodeConfigVisible: true});
  }
  handleIPChange = (v) => {
    this.state.ip = v;
  }
  handlePortChange = (v) => {
    this.state.port = v;
  }
  onConfigNodeOK = () => {
    if (this.state.ip == '') {
      Feedback.toast.error('请输入IP地址');
      return;
    }
    if (this.state.port == '') {
      Feedback.toast.error('请输入端口');
      return;
    }
    var nodeInfo = "http://" + this.state.ip + ":" + this.state.port;
    cookie.save("nodeInfo", nodeInfo);
    axios.defaults.baseURL = nodeInfo;
    this.setState({nodeConfigVisible: false});
  }
  render() {
    const { profile, isMobile, theme, width, className, style } = this.props;
    return (
      <Layout.Header
        theme={theme}
        className={cx('ice-design-layout-header', className)}
        style={{ ...style, width }}
      >
        <Logo />
        <div
          className="ice-design-layout-header-menu"
          style={{ display: 'flex' }}
        >
        <Button type="primary" onClick={this.openSetDialog.bind(this)}><Icon type="set" />设置节点</Button>
        <Dialog
          visible={this.state.nodeConfigVisible}
          title="配置节点"
          footerActions='ok'
          footerAlign='center'
          closeable='true'
          onOk={this.onConfigNodeOK.bind(this)}
          onCancel={() => this.setState({nodeConfigVisible: false})}
          onClose={() => this.setState({nodeConfigVisible: false})}
        >
          <Input hasClear
            onChange={this.handleIPChange.bind(this)} 
            style={{ width: 400 }}
            addonBefore="IP"
            size="medium"
            defaultValue=""
            maxLength={15}
            hasLimitHint
          />
          <br/>
          <br/>
          <Input hasClear
            onChange={this.handlePortChange.bind(this)} 
            style={{ width: 400 }}
            addonBefore="RPC端口"
            size="medium"
            defaultValue=""
            maxLength={5}
            hasLimitHint
            onPressEnter={this.onConfigNodeOK.bind(this)}
          />
        </Dialog> 

          {/* <Search
            style={{ fontSize: '12px' }}
            size="large"
            inputWidth={400}
            searchText="Search"
            placeholder="Search by Address / Txhash / Block / Token / Ens"
          /> */}
          {/* Header 菜单项 begin */}
          {headerMenuConfig && headerMenuConfig.length > 0 ? (
            <Menu mode="horizontal" selectedKeys={[]}>
              {headerMenuConfig.map((nav, idx) => {
                const linkProps = {};
                if (nav.newWindow) {
                  linkProps.href = nav.path;
                  linkProps.target = '_blank';
                } else if (nav.external) {
                  linkProps.href = nav.path;
                } else {
                  linkProps.to = nav.path;
                }
                return (
                  <Menu.Item key={idx}>
                    {linkProps.to ? (
                      <Link {...linkProps}>
                        {nav.icon ? (
                          <FoundationSymbol type={nav.icon} size="small" />
                        ) : null}
                        {!isMobile ? nav.name : null}
                      </Link>
                    ) : (
                      <a {...linkProps}>
                        {nav.icon ? (
                          <FoundationSymbol type={nav.icon} size="small" />
                        ) : null}
                        {!isMobile ? nav.name : null}
                      </a>
                    )}
                  </Menu.Item>
                );
              })}
            </Menu>
          ) : null}
          {/* Header 菜单项 end */}

          {/* Header 右侧内容块 */}

          {/* <Balloon
            visible={false}
            trigger={
              <div
                className="ice-design-header-userpannel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 12,
                }}
              >
                <IceImg
                  height={40}
                  width={40}
                  src={
                    profile.avatar ||
                    'https://img.alicdn.com/tfs/TB1L6tBXQyWBuNjy0FpXXassXXa-80-80.png'
                  }
                  className="user-avatar"
                />
                <div className="user-profile">
                  <span className="user-name" style={{ fontSize: '13px' }}>
                    {profile.name}
                  </span>
                  <br />
                  <span
                    className="user-department"
                    style={{ fontSize: '12px', color: '#999' }}
                  >
                    {profile.department}
                  </span>
                </div>
                <Icon
                  type="arrow-down-filling"
                  size="xxs"
                  className="icon-down"
                />
              </div>
            }
            closable={false}
            className="user-profile-menu"
          >
            <ul>
              <li className="user-profile-menu-item">
                <FoundationSymbol type="person" size="small" />我的主页
              </li>
              <li className="user-profile-menu-item">
                <FoundationSymbol type="repair" size="small" />设置
              </li>
              <li
                className="user-profile-menu-item"
                onClick={this.props.handleLogout}
              >
                <FoundationSymbol type="compass" size="small" />退出
              </li>
            </ul>
          </Balloon> */}
        </div>
      </Layout.Header>
    );
  }
}
