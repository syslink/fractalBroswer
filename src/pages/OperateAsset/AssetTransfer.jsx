/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { Grid, Input, Select, Button } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';

const { Row } = Grid;

const getUserAccount = ()=>{

}

export default class AssetTransfer extends Component {
  static displayName = 'AssetTransfer';

  constructor(props) {
    super(props);
    this.state = {
      userAccounts: getUserAccount(),
      value: {
        fromUser: '',
        toUserAddr: '',
        assetId: '',
        amount: '',
      },
    };
    this.formChange = this.formChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  formChange = (value) => {
    console.log('value', value);
    this.setState({
      value,
    });
  };

  onChange(value) {
    this.setState({
      value
    });
  }

  onSubmit(e) {

  }

  render() {
    const assetTypeList = [
        {
          value: 0,
          label: "Account"
        },
        {
          value: 1,
          label: "UTXO"
        }
      ];

    return (
        <IceFormBinderWrapper
            value={this.state.value}
            onChange={this.formChange}
            ref="form"
        >
            <div style={styles.formContent}>
                <Row style={styles.formRow} justify='center'>
                    From User:{" "}
                    <IceFormBinder required message="Required!">
                        <Select
                            name="fromUser"
                            dataSource={this.state.userAccounts}
                        />
                    </IceFormBinder>
                </Row>
                <Row style={styles.formRow} justify='center'>
                    <IceFormBinder required message="Required!">
                        <Input hasClear
                            addonBefore="To Addr:"
                            name="toUserAddr"
                            size="large"
                            maxLength={22}
                        />
                    </IceFormBinder>
                </Row>
                <Row style={styles.formRow} justify='center'>
                    <IceFormBinder required message="Required!">
                        <Input hasClear
                            addonBefore="Asset Id:"
                            name="assetId"
                            size="large"
                        />
                    </IceFormBinder>
                </Row>
                <Row style={styles.formRow} justify='center'>
                    <IceFormBinder required message="Required!">
                        <Input hasClear
                            addonBefore="Amount:"
                            name="amount"
                            size="large"
                        />
                    </IceFormBinder>
                </Row>
                <Row style={styles.formRow} justify='center'>
                    <Button type="normal" onClick={this.onSubmit}>Submit</Button>
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
