/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { Grid, Input, Feedback, Button } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import * as rpc from '../../api'
import * as action from '../../utils/constant'
import {encode} from 'rlp'

const { Row } = Grid;

export default class AssetIssueTable extends Component {
  static displayName = 'AssetIssueTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        assetName: '',
        symbol: '',
        amount: 0,
        decimals: 0,
        owner: '',
        founder:'',
        upperLimit: 0,
      },
    };
    console.log(props.accountName + "  " + props.password);
  }

  formChange = (value) => {
    this.setState({
      value,
    });
  };

  onSubmit = async (e) => {
    var {value} = this.state;
    var assetNameReg = new RegExp("^[a-z0-9]{2,16}$");
    if (!assetNameReg.test(value.assetName)) {
        Feedback.toast.error("资产名称错误");
        return;
    }
    var resp = await rpc.getAssetInfoByName([value.assetName]);
    if (resp.data.result != null) {
        Feedback.toast.error("资产名称已存在");
        return;
    }
    var assetSymbolReg = new RegExp("^[a-z0-9]{2,16}$");
    if (!assetSymbolReg.test(value.symbol)) {
        Feedback.toast.error("资产符号错误");
        return;
    }
    if (value.amount == 0) {
        Feedback.toast.error("资产金额必须大于0");
        return;
    }
    resp = await rpc.isAccountExist([value.owner]);
    if (resp.data.result == false) {
        Feedback.toast.error("管理者不存在");
        return;
    }
    resp = await rpc.isAccountExist([value.founder]);
    if (resp.data.result == false) {
        Feedback.toast.error("创办者不存在");
        return;
    }
    var curAccountName = this.props.accountName;
    var password = this.props.password;
    if (curAccountName = '' || password == '') {
        Feedback.toast.error("请先选择操作资产的账户，并输入对应的密码");
        return;
    }
    var params = {};
    params.actionType = action.ISSUE_ASSET;
    params.accountName = curAccountName;
    params.password = password;
    /*
    	AssetId    uint64      `json:"assetId,omitempty"`
	AssetName  string      `json:"assetName,omitempty"`
	Symbol     string      `json:"symbol,omitempty"`
	Amount     *big.Int    `json:"amount,omitempty"`
	Decimals   uint64      `json:"decimals,omitempty"`
	Founder    common.Name `json:"founder,omitempty"`
	Owner      common.Name `json:"owner,omitempty"`
	AddIssue   *big.Int    `json:"addIssue,omitempty"`
	UpperLimit *big.Int    `json:"upperLimit,omitempty"`
    */
    var rlpData = encode([0, value.assetName, value.symbol, value.amount, value.decimals, value.founder, value.owner, 0, value.upperLimit]);
    parmas.data = rlpData;
    rpc.sendTransaction(parmas);
  }

  render() {
    return (
        <IceFormBinderWrapper
            value={this.state.value}
            onChange={this.formChange.bind(this)}
            ref="form"
        >
            <div style={styles.formContent}>
                <Row style={styles.formRow} justify='center'>
                    <IceFormBinder required message="请输入正确的资产名称" pattern='^[a-z0-9]{2,16}$'>
                        <Input hasClear
                            addonBefore="名称:"  //"^[a-z0-9]{2,16}$"
                            name="assetName"
                            size="large"
                            placeholder="a~z、0~9组成，2-16位"
                            maxLength={16}
                        />
                    </IceFormBinder>
                </Row>
                <Row style={styles.formRow} justify='center'>
                    <IceFormBinder required message="请输入正确的资产符号" pattern='^[a-z0-9]{2,16}$'>
                        <Input hasClear
                            addonBefore="符号:"  //"^[a-z0-9]{2,16}$"
                            name="symbol"
                            size="large"
                            placeholder="a~z、0~9组成，2-16位"
                            maxLength={16}
                        />
                    </IceFormBinder>
                </Row>
                <Row style={styles.formRow} justify='center'>
                    <IceFormBinder required message="请输入正确金额" pattern='^[1-9][0-9]*'>
                        <Input hasClear
                            addonBefore="金额:"
                            name="amount"
                            size="large"
                        />
                    </IceFormBinder>
                </Row>
                <Row style={styles.formRow} justify='center'>
                    <IceFormBinder required message="请输入正确精度" pattern='^[1-9][0-9]'>
                        <Input hasClear
                            addonBefore="精度:"
                            name="decimals"
                            size="large"
                            maxLength={2}
                        />
                    </IceFormBinder>
                </Row>
                <Row style={styles.formRow} justify='center'>
                    <IceFormBinder required pattern='^[a-z0-9]{8,16}$'>
                        <Input hasClear
                            addonBefore="管理者:"
                            name="owner"
                            size="large"
                            placeholder="可对此资产进行管理"
                            maxLength={16}
                        />
                    </IceFormBinder>
                </Row>
                <Row style={styles.formRow} justify='center'>
                    <IceFormBinder required pattern='^[a-z0-9]{8,16}$'>
                        <Input hasClear
                            addonBefore="创办者:"
                            name="founder"
                            size="large"
                            placeholder="可收取相关手续费"
                            maxLength={16}
                        />
                    </IceFormBinder>
                </Row>
                <Row style={styles.formRow} justify='center'>
                    <IceFormBinder required pattern='^[1-9][0-9]*'>
                        <Input hasClear
                            addonBefore="增发上限:"
                            name="upperLimit"
                            size="large"
                            placeholder="今后增发此资产的上限"
                        />
                    </IceFormBinder>
                </Row>
                <Row style={styles.formRow} justify='center'>
                    <Button type="normal" onClick={this.onSubmit.bind(this)}>提交</Button>
                </Row>
            </div>
        </IceFormBinderWrapper>
    );
  }
}

const styles = {
    formContent: {
        width: '100%',
        position: 'relative',
        },
    container: {
        margin: '10px',
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
        margin: '10px 0'
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
