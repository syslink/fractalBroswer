/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { Grid, Input, Radio, Button, Select, Dialog, Feedback } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import * as rpc from '../../api';
import * as action from '../../utils/constant';
import {saveTxHash} from '../../utils/utils'
import {encode} from 'rlp';
import BigNumber from 'bignumber.js';

const { Row, Col } = Grid;
const { Group: RadioGroup } = Radio;

export default class AssetFounderSet extends Component {
  static displayName = 'AssetFounderSet';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        assetId: null,
        founder: ''
      },
      assetInfoSet: [],
      inputPasswordVisible: false,
    };
  }
  getAssetInfoOfOwner = async (accountName, _this) => {
      var resp = await rpc.getAccountInfo([accountName]);
      var assetInfoSet = [];
      if (resp.data.hasOwnProperty("result") && resp.data.result != null) {
        var account = resp.data.result;
        for (let balance of account.balances) {
            var resp = await rpc.getAssetInfoById([balance.assetID]);
            if (resp.data.hasOwnProperty("result") && resp.data.result != null) {
                var assetInfo = resp.data.result;
                if (assetInfo.owner == accountName) {
                    assetInfo['label'] = assetInfo.assetId + '--' + assetInfo.assetName;
                    assetInfo['value'] = assetInfo.assetId;
                    assetInfoSet.push(assetInfo);
                }
            }
        }
        _this.setState({assetInfoSet: assetInfoSet, assetId: ''});
      }
  }
  componentWillReceiveProps(nextProps) {
    this.getAssetInfoOfOwner(nextProps.accountName, this);
  }
  formChange = (value) => {
    this.setState({
      value,
    });
  };

  onSubmit = async (e) => {
    var {value} = this.state;
    
    var curAccountName = this.props.accountName;
    if (curAccountName == '') {
        Feedback.toast.error("请选择需要操作资产的账户");
        return;
    }

    if (value.assetId == '') {
        Feedback.toast.error('请选择需要改变创办者的资产ID');
        return;
    }

    var selectedAsset;
    for (let assetInfo of this.state.assetInfoSet) {
        if (assetInfo.assetId == value.assetId) {
            selectedAsset = assetInfo;
            this.state.decimals = assetInfo.decimals;
            break;
        }
    }

    if (value.founder == '') {
        Feedback.toast.error('请输入创办者的账户名称');
        return;
    }

    var resp = await rpc.isAccountExist([value.founder]);
    if (resp.data.result == false) {
        Feedback.toast.error("创办者不存在");
        return;
    }
    this.setState({
        inputPasswordVisible: true,
    }); 
  }
  onClose = (e) => {
    this.setState({
        inputPasswordVisible: false,
      }); 
  }

  handlePasswordChange = (v) => {
      this.state.password = v;
  }

  onInputPasswordOK = async (e) => {
    var {value} = this.state;
    if (this.state.password == '') {
        Feedback.toast.error("请先输入账户所绑定密钥对应的密码");
        return;
    }
    this.onClose();

    var curAccountName = this.props.accountName;
    var password = this.state.password;
    var assetId = parseInt(value.assetId);
    var founder = value.founder;

    var params = {};
    params.actionType = action.SET_ASSET_FOUNDER;
    params.accountName = curAccountName;
    params.password = password;
    
    var rlpData = encode([assetId, '', '', 0, 0, founder, '', 0, 0]);
    params.data = '0x' + rlpData.toString('hex');
    console.log(params.data);
    try {
        const response = await rpc.sendTransaction(params);
        if (response.status == 200) {
            if (response.data.result != null) {
                saveTxHash(params.accountName, params.actionType, response.data.result);
                Feedback.toast.success("交易发送成功");
            } else {
                Feedback.toast.error("交易发送失败:" + response.data.error.message);
            }
        } else {
            Feedback.toast.error("交易发送失败, 错误号:" + response.status);
        }
        return response.data;
    } catch (error) {
        Feedback.toast.error("交易发送失败, 错误信息:" + error);
    }
  }
  render() {

    return (
        <div>
            <IceFormBinderWrapper
                value={this.state.value}
                onChange={this.formChange}
                ref="form"
            >
                <div style={styles.formContent}>
                    <Row style={styles.formRow} justify='center'>
                        需改变创办者的资产ID:
                        <IceFormBinder required message="Required!">                        
                            <Select
                                dataSource={this.state.assetInfoSet}
                                name='assetId'
                            ></Select>
                        </IceFormBinder>
                    </Row>
                    <Row style={styles.formRow} justify='center'>
                        <IceFormBinder required message="Required!">
                            <Input hasClear
                                addonBefore="创办者:"
                                name="founder"
                                size="large"
                            />
                        </IceFormBinder>
                    </Row>
                    <Row style={styles.formRow} justify='center'>
                        <Button type="normal" onClick={this.onSubmit}>提交</Button>
                    </Row>
                </div>
            </IceFormBinderWrapper>
            <Dialog
                visible={this.state.inputPasswordVisible}
                title="输入密码"
                footerActions='ok'
                footerAlign='center'
                closeable='true'
                onOk={this.onInputPasswordOK.bind(this)}
                onCancel={this.onClose.bind(this)}
                onClose={this.onClose.bind(this)}
                >
                <Input hasClear
                    htmlType="password"
                    onChange={this.handlePasswordChange.bind(this)} 
                    style={{ width: 400 }}
                    addonBefore="密码"
                    size="medium"
                    defaultValue=""
                    maxLength={20}
                    hasLimitHint
                    onPressEnter={this.onInputPasswordOK.bind(this)}
                />
            </Dialog> 
        </div>
    );
  }
}

const styles = {
    formContent: {
        width: '100%',
        position: 'relative',
        },
    container: {
        margin: '20px',
        padding: '0',
    },
    title: {
        margin: '0',
        padding: '20px',
        fonSize: '16px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        color: 'rgba(0,0,0,.85)',
        fontWeight: '500',
        borderBottom: '1px solid #eee',
    },
    formRow: {
        margin: '10px 0',
        alignItems: 'center',
    },
    formItem: {
        display: 'flex',
        alignItems: 'center',
        margin: '10px 0',
    },
    formLabel: {
        minWidth: '70px',
    },
};