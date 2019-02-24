import {
  BIND_ACCOUNT_REQUEST	,
  BIND_ACCOUNT_SUCCESS	,
  BIND_ACCOUNT_FAILURE	,
    
  UPDATE_BOUND_REQUEST	,
  UPDATE_BOUND_SUCCESS	,
  UPDATE_BOUND_FAILURE	,
    
  DELETE_BOUND_REQUEST	,
  DELETE_BOUND_SUCCESS	,
  DELETE_BOUND_FAILURE	,
    
  GET_BOUND_REQUEST	,
  GET_BOUND_SUCCESS	,
  GET_BOUND_FAILURE	,

  GET_KEYSTORE_REQUEST,
  GET_KEYSTORE_SUCCESS,
  GET_KEYSTORE_FAILURE,

  CREATE_ACCOUNT_BY_SYSTEM_DIALOG,
  CREATE_ACCOUNT_BY_SYSTEM_TX_REQUEST,
  CREATE_ACCOUNT_BY_SYSTEM_TX_SUCCESS,
  CREATE_ACCOUNT_BY_SYSTEM_TX_FAILURE,

  CREATE_ACCOUNT_BY_SELF_DIALOG,

  GET_ACCOUNT_INFO_REQUEST,
  GET_ACCOUNT_INFO_SUCCESS,
  GET_ACCOUNT_INFO_FAILURE,


  IMPORT_ACCOUNT_DIALOG_OPEN,
  IMPORT_ACCOUNT_DIALOG_CLOSE,
  IMPORT_ACCOUNT_REQUEST,
  IMPORT_ACCOUNT_SUCCESS,
  IMPORT_ACCOUNT_FAILURE,

  TRANSFER_DIALOG,
  TRANSFER_REQUEST,
  TRANSFER_SUCCESS,
  TRANSFER_FAILURE,
  CREATE_ACCOUNT_BY_SYSTEM_DIALOG_OPEN,
  CREATE_ACCOUNT_BY_SYSTEM_DIALOG_CLOSE,
  CREATE_ACCOUNT_BY_SELF_DIALOG_OPEN,
  CREATE_ACCOUNT_BY_SELF_DIALOG_CLOSE,
  TRANSFER_DIALOG_OPEN,
  TRANSFER_DIALOG_CLOSE,
  CLOSE_FAIL_DIALOG,
} from './constants';

const initialState = {
  isLoading: false,
  accountNames: [],
  keystoreInfo: [],
  accountInfos: [],
  failInfo: '',
  closeDialog: false,
  cachedAccountInfos: [],
};
const getAccountInfo = (state, accountName) => {
  for( let accountInfo of state.cachedAccountInfos){
    if (accountInfo.accountName == accountName) {
      return accountInfo;
    }
  }
  return {};
}
const isValidAccount = (account) => {
  if(account.accountName == undefined || account.publicKey == undefined) {
    return false;
  }
  return true;
}
// 将新账户信息列表加入已有账户信息列表中，需要考虑：
// 1：所有账户都需要检查其公私钥是否在本地，这里只要判断公钥是否存在即可
// 2：账号绑定的公钥存在被更新的可能，因此已有列表中的账户也要更新
// 所以我们需要：
// 1：生成一个临时列表，将已有账户信息都导进去
// 2：将新增列表中的账户一个个取出来，跟临时列表中的账户一个个进行对比，
//   2.1: 如果有相同账户名的，则替换，并检查有效性
//   2.2: 如果没有相同账户名，则直接加入，并检查有效性
const addAccountInfo = (state, newAccountInfos) => {

  if (newAccountInfos.length == 0) {
    return state.accountInfos;
  }
  var keystorePubKeys = '';
  for (let keystore of state.keystoreInfo) {
    keystorePubKeys += keystore.publicKey;
  }
  var accountInfos = [];
  for( let accountInfo of state.accountInfos){
    accountInfos.push(accountInfo);
  }
  for (let newAccountInfo of newAccountInfos) {
    if (!isValidAccount(newAccountInfo)) {
      continue;
    }
    newAccountInfo['valid'] = keystorePubKeys.indexOf(newAccountInfo.publicKey) != -1; 
    var replaced = false;
    for(var i = 0,len = accountInfos.length; i < len; i++) { 
      if (accountInfos[i].accountName == newAccountInfo.accountName) {
        accountInfos[i] = newAccountInfo;    
        replaced = true;  
        break;
      } 
    }
    
    if (!replaced) {
      accountInfos.push(newAccountInfo);
    }
  }

  console.log("state.accountInfos after added:" + accountInfos.length + "--" + accountInfos);
  return accountInfos;
}

function accountMgrReducer(state = initialState, action) {
  console.log(action.type);
  switch (action.type) {
    case BIND_ACCOUNT_REQUEST:
      return Object.assign({}, state, {
      });
    case BIND_ACCOUNT_SUCCESS:   
      console.log(action.type);
      var boundAccount = getAccountInfo(state, action.result);
      return Object.assign({}, state, {
        isLoading: false,
        accountInfos: addAccountInfo(state, [boundAccount]),    // 每次绑定成功后都会将账号信息显示在前端
        accountNames: [...state.accountNames, boundAccount.accountName],
        failInfo: '',
      });
    case BIND_ACCOUNT_FAILURE:
      return Object.assign({}, state, {
        failInfo: action.result,
      });

    case UPDATE_BOUND_REQUEST:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    case UPDATE_BOUND_SUCCESS:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        failInfo: '',
      });
    case UPDATE_BOUND_FAILURE:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        failInfo: action.result,
      });

    case DELETE_BOUND_REQUEST:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    case DELETE_BOUND_SUCCESS:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        accountInfos: state.accountInfos.filter(item => item.accountName != action.result),
        failInfo: '',
      });
    case DELETE_BOUND_FAILURE:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        failInfo: action.result,
      });

    case GET_BOUND_REQUEST:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    case GET_BOUND_SUCCESS:
      console.log("state.accountInfos:" + state.accountInfos.length + "--" + state.accountInfos);
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        accountInfos: addAccountInfo(state, action.result),        // 将查询得到的所有的账号信息显示在前端
        accountNames: [...state.accountNames, action.result.accountName],
        failInfo: '',
      });
    case GET_BOUND_FAILURE:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        failInfo: action.result,
      });

    case GET_KEYSTORE_REQUEST:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    case GET_KEYSTORE_SUCCESS:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        keystoreInfo: action.result,
        failInfo: '',
      });
    case GET_KEYSTORE_FAILURE:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        failInfo: action.result,
      });
    case CREATE_ACCOUNT_BY_SYSTEM_DIALOG_OPEN:
      return Object.assign({}, state, {
        systemHelpVisible: true,
      });
    case CREATE_ACCOUNT_BY_SYSTEM_DIALOG_CLOSE:
      return Object.assign({}, state, {
        systemHelpVisible: false,
      });
    
    case CREATE_ACCOUNT_BY_SELF_DIALOG_OPEN:
      return Object.assign({}, state, {
        selfHelpVisible: true,
      });
    
    case CREATE_ACCOUNT_BY_SELF_DIALOG_CLOSE:
      return Object.assign({}, state, {
        selfHelpVisible: false,
      });
    case CREATE_ACCOUNT_BY_SYSTEM_TX_REQUEST:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    case CREATE_ACCOUNT_BY_SYSTEM_TX_SUCCESS:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        createAccountResult: action.result,
        failInfo: '',
        systemHelpVisible: false,
        selfHelpVisible: false,
      });
    case CREATE_ACCOUNT_BY_SYSTEM_TX_FAILURE:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        failInfo: action.result,
      })

    case GET_ACCOUNT_INFO_REQUEST:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    case GET_ACCOUNT_INFO_SUCCESS:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        cachedAccountInfos: [...state.cachedAccountInfos, action.result],
        failInfo: '',
      });
    case GET_ACCOUNT_INFO_FAILURE:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        failInfo: action.result,
      });
    
    case TRANSFER_DIALOG_OPEN:
      return Object.assign({}, state, {
        transferVisible: true,
      });
    
    case TRANSFER_DIALOG_CLOSE:
      return Object.assign({}, state, {
        transferVisible: false,
      });
    case TRANSFER_REQUEST:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });    
    case TRANSFER_SUCCESS:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        txHash: action.result,
        failInfo: '',
        transferVisible: false,
      });   
    case TRANSFER_FAILURE:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        failInfo: action.result,
      });   
    case CLOSE_FAIL_DIALOG:
      return Object.assign({}, state, {
        failInfo: '',
      });  
    case IMPORT_ACCOUNT_DIALOG_OPEN:
      return Object.assign({}, state, {
        importAccountVisible: true,
      });
    case IMPORT_ACCOUNT_DIALOG_CLOSE:
      return Object.assign({}, state, {
        importAccountVisible: false,
      });
    case IMPORT_ACCOUNT_REQUEST:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });   
    case IMPORT_ACCOUNT_SUCCESS:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        failInfo: '',
        importAccountVisible: false,
      });   
    case IMPORT_ACCOUNT_FAILURE:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        failInfo: action.result,
      });   
    default:
      return state;
  }
}

export default accountMgrReducer;