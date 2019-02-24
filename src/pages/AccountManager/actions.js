import {bindAccountPublicKeyReq, 
        updateBoundInfoReq, 
        deleteBoundInfoReq, 
        getBoundInfoReq, 
        getKeystoreReq, 
        createAccountBySystemReq,
        getAccountInfoReq,} from './api';
import { sendTransaction } from '../../api';
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


  CREATE_ACCOUNT_BY_SYSTEM_DIALOG_OPEN,
  CREATE_ACCOUNT_BY_SYSTEM_DIALOG_CLOSE,
  CREATE_ACCOUNT_BY_SYSTEM_TX_REQUEST,
  CREATE_ACCOUNT_BY_SYSTEM_TX_SUCCESS,
  CREATE_ACCOUNT_BY_SYSTEM_TX_FAILURE,

  CREATE_ACCOUNT_BY_SELF_DIALOG_OPEN,
  CREATE_ACCOUNT_BY_SELF_DIALOG_CLOSE,

  GET_ACCOUNT_INFO_REQUEST,
  GET_ACCOUNT_INFO_SUCCESS,
  GET_ACCOUNT_INFO_FAILURE,

  IMPORT_ACCOUNT_DIALOG_OPEN,
  IMPORT_ACCOUNT_DIALOG_CLOSE,
  IMPORT_ACCOUNT_REQUEST,
  IMPORT_ACCOUNT_SUCCESS,
  IMPORT_ACCOUNT_FAILURE,

  TRANSFER_DIALOG_OPEN,
  TRANSFER_DIALOG_CLOSE,
  TRANSFER_REQUEST,
  TRANSFER_SUCCESS,
  TRANSFER_FAILURE,

  CLOSE_FAIL_DIALOG,

  RPC_REQUEST_FAILURE,
  CREATE_NEW_ACCOUNT,
} from './constants';

import cookie from 'react-cookies'

const bindAccountPublicKeyAction = () => {
  return {
    type: BIND_ACCOUNT_REQUEST
  };
};

const bindAccountPublicKeySuccessAction = (payload) => {
  return {
    type: BIND_ACCOUNT_SUCCESS,
    result: payload,
  };
};

const  bindAccountPublicKeyFailAction = (payload) => {
  return {
    type: BIND_ACCOUNT_FAILURE,
    result: payload,
  };
};

const updateBoundInfoAction = () => {
  return {
    type: UPDATE_BOUND_REQUEST,
    isLoading: true,
  };
};

const updateBoundInfoSuccessAction = (payload) => {
  return {
    type: UPDATE_BOUND_SUCCESS,
    result: payload,
    isLoading: false,
  };
};

const updateBoundInfoFailAction = (payload) => {
  return {
    type: UPDATE_BOUND_FAILURE,
    result: payload,
    isLoading: false,
  };
};

const deleteBoundInfoAction = () => {
  return {
    type: DELETE_BOUND_REQUEST,
    isLoading: true,
  };
};

const deleteBoundInfoSuccessAction = (payload) => {
  return {
    type: DELETE_BOUND_SUCCESS,
    result: payload,
    isLoading: false,
  };
};

const deleteBoundInfoFailAction = (payload) => {
  return {
    type: DELETE_BOUND_FAILURE,
    result: payload,
    isLoading: false,
  };
};

const getBoundInfoAction = () => {
  return {
    type: GET_BOUND_REQUEST,
    isLoading: true,
  };
};

const getBoundInfoSuccessAction = (payload) => {
  return {
    type: GET_BOUND_SUCCESS,
    result: payload,
    isLoading: false,
  };
};

const getBoundInfoFailAction = (payload) => {
  return {
    type: GET_BOUND_FAILURE,
    result: payload,
    isLoading: false,
  };
};

const getKeystoreAction = () => {
  return {
    type: GET_KEYSTORE_REQUEST,
    isLoading: true,
  };
};

const getKeystoreSuccessAction = (payload) => {
  return {
    type: GET_KEYSTORE_SUCCESS,
    result: payload,
    isLoading: false,
  };
};

const getKeystoreFailAction = (payload) => {
  return {
    type: GET_KEYSTORE_FAILURE,
    result: payload,
    isLoading: false,
  };
};

const openDialogOfCreateAccountBySystemAction = () => {
  return {
    type: CREATE_ACCOUNT_BY_SYSTEM_DIALOG_OPEN,
  };
};

const closeDialogOfCreateAccountBySystemAction = () => {
  return {
    type: CREATE_ACCOUNT_BY_SYSTEM_DIALOG_CLOSE,
  };
};

const createAccountBySystemAction = () => {
  return {
    type: CREATE_ACCOUNT_BY_SYSTEM_TX_REQUEST,
    isLoading: true,
  };
};

const createAccountBySystemSuccessAction = (payload) => {
  return {
    type: CREATE_ACCOUNT_BY_SYSTEM_TX_SUCCESS,
    result: payload,
    isLoading: false,
  };
};

const createAccountBySystemFailAction = (payload) => {
  return {
    type: CREATE_ACCOUNT_BY_SYSTEM_TX_FAILURE,
    result: payload,
    isLoading: false,
  };
};

const openDialogOfCreateAccountBySelfAction = () => {
  return {
    type: CREATE_ACCOUNT_BY_SELF_DIALOG_OPEN,
  };
};

const closeDialogOfCreateAccountBySelfAction = () => {
  return {
    type: CREATE_ACCOUNT_BY_SELF_DIALOG_CLOSE,
  };
};

const closeFailDialogAction = () => {
  return {
    type: CLOSE_FAIL_DIALOG,
  };
};

const getAccountInfoAction = () => {
  return {
    type: GET_ACCOUNT_INFO_REQUEST,
    isLoading: true,
  };
};

const getAccountInfoSuccessAction = (payload) => {
  return {
    type: GET_ACCOUNT_INFO_SUCCESS,
    result: payload,
    isLoading: false,
  };
};

const getAccountInfoFailAction = (payload) => {
  return {
    type: GET_ACCOUNT_INFO_FAILURE,
    result: payload,
    isLoading: false,
  };
};


const openImportAccountDialogAction = () => {
  return {
    type: IMPORT_ACCOUNT_DIALOG_OPEN,
  };
};

const closeImportAccountDialogAction = () => {
  return {
    type: IMPORT_ACCOUNT_DIALOG_CLOSE,
  };
};

const importAccountAction = () => {
  return {
    type: IMPORT_ACCOUNT_REQUEST,
    isLoading: true,
  };
};

const importAccountSuccessAction = (payload) => {
  return {
    type: IMPORT_ACCOUNT_SUCCESS,
    result: payload,
    isLoading: false,
  };
};

const importAccountFailAction = (payload) => {
  return {
    type: IMPORT_ACCOUNT_FAILURE,
    result: payload,
    isLoading: false,
  };
};

const openTransferDialogAction = () => {
  return {
    type: TRANSFER_DIALOG_OPEN,
  };
};

const closeTransferDialogAction = () => {
  return {
    type: TRANSFER_DIALOG_CLOSE,
  };
};

const transferRequestAction = () => {
  return {
    type: TRANSFER_REQUEST,
    isLoading: true,
  };
};

const transferSuccessAction = (payload) => {
  return {
    type: TRANSFER_SUCCESS,
    result: payload,
    isLoading: false,
  };
};

const transferFailAction = (payload) => {
  return {
    type: TRANSFER_FAILURE,
    result: payload,
    isLoading: false,
  };
};


// 绑定账户：
// 节点钱包会获取账户信息，若存在，则将账号和公钥保存在本地硬盘上
export const bindAccountPublicKey = (params) => {
  return async (dispatch) => {
    dispatch(bindAccountPublicKeyAction());
    try {
      const response = await bindAccountPublicKeyReq(params);
      if (response.data.hasOwnProperty("result")) {
          dispatch(bindAccountPublicKeySuccessAction(params));
      } else if (response.data.hasOwnProperty("error")) {
        dispatch(bindAccountPublicKeyFailAction(response.data.error));
      }
      return response.data;
    } catch (error) {
      dispatch(bindAccountPublicKeyFailAction(error));
    }
  }
}

export const deleteBoundInfo = (params) => {
  return async (dispatch) => {
    dispatch(deleteBoundInfoAction());
    try {
      const response = await deleteBoundInfoReq(params);
      if (response.data.hasOwnProperty("result")) {
        dispatch(deleteBoundInfoSuccessAction(...params));
      } else if (response.data.hasOwnProperty("error")) {
        dispatch(deleteBoundInfoFailAction(response.data.error));
      }
      return response.data;
    } catch (error) {
      dispatch(deleteBoundInfoFailAction(error));
    }
  }
}

export const updateBoundInfo = (params) => {
  return async (dispatch) => {
    dispatch(updateBoundInfoAction());
    try {
      const response = await updateBoundInfoReq(params);
      if (response.data.hasOwnProperty("result")) {
        dispatch(updateBoundInfoSuccessAction(response.data.result));
      } else if (response.data.hasOwnProperty("error")) {
        dispatch(updateBoundInfoFailAction(response.data.error));
      }
      return response.data;
    } catch (error) {
      dispatch(updateBoundInfoFailAction(error));
    }
  }
}

export const getBoundInfo = (params) => {
  return async (dispatch) => {
    dispatch(getBoundInfoAction());
    try {
      const response = await getBoundInfoReq(params);
      if (response.data.hasOwnProperty("result")) {
        if (response.data.result != undefined) {
          dispatch(getBoundInfoSuccessAction(response.data.result));
        } else {
          dispatch(getBoundInfoSuccessAction([]));
        }
      } else if (response.data.hasOwnProperty("error")) {
        dispatch(getBoundInfoFailAction(response.data.error));
      }
      return response.data;
    } catch (error) {
      dispatch(getBoundInfoFailAction(error));
    }
  }
}

// 获取keystore信息成功后便会查询所有的账号绑定信息
export const getKeystore = (params) => {
  return async (dispatch) => {
    dispatch(getKeystoreAction());
    try {
      const response = await getKeystoreReq(params);
      if (response.data.hasOwnProperty("result")) {
        dispatch(getKeystoreSuccessAction(response.data.result));
        var publicKeys = []
        for (let keyInfo of response.data.result) {
          publicKeys.push(keyInfo.publicKey);
        }
        dispatch(getBoundInfo([[...publicKeys]]));
      } else if (response.data.hasOwnProperty("error")) {
        dispatch(getKeystoreFailAction(response.data.error));
      }
      return response.data;
    } catch (error) {
      dispatch(getKeystoreFailAction(error));
    }
  }
}

export const openDialogOfCreateAccountBySystem = (params) => {
  return async (dispatch) => {
    dispatch(openDialogOfCreateAccountBySystemAction());
  }
}

export const closeDialogOfCreateAccountBySystem = (params) => {
  return async (dispatch) => {
    dispatch(closeDialogOfCreateAccountBySystemAction());
  }
}

export const openDialogOfCreateAccountBySelf = (params) => {
  return async (dispatch) => {
    dispatch(openDialogOfCreateAccountBySelfAction());
  }
}

export const closeDialogOfCreateAccountBySelf = (params) => {
  return async (dispatch) => {
    dispatch(closeDialogOfCreateAccountBySelfAction());
  }
}

export const closeFailDialog = (params) => {
  return async (dispatch) => {
    dispatch(closeFailDialogAction());
  }
}

// 此方法执行成功后需要关闭创建页面
export const createAccountBySystem = (params) => {
  return async (dispatch) => {
    dispatch(createAccountBySystemAction());
    try {
      const response = await createAccountBySystemReq(params);
      if (response.status == 200) {
        if (response.data.code == 0) {
          saveTxHash(params.accountName, CREATE_NEW_ACCOUNT, response.data.message);
          dispatch(createAccountBySystemSuccessAction(''));
          setTimeout(() => {
            dispatch(getAccountInfo([params.accountName])).then(resp => {
              if (resp.hasOwnProperty("result")) {
                dispatch(bindAccountPublicKey([resp.result.accountName]));
              } 
            });
          }, 3000);
        } else {
          dispatch(createAccountBySystemFailAction(response.data.message));
        }
      } else {
        dispatch(createAccountBySystemFailAction(response.status));
      }
      return response.data;
    } catch (error) {
      dispatch(createAccountBySystemFailAction(error));
    }
  }
}

export const createAccountBySelf = (params) => {
  return async (dispatch) => {
    dispatch(createAccountBySystemAction());
    try {
      const response = await sendTransaction(params);
      if (response.status == 200) {
        if (response.data.result != null) {
          saveTxBothFromAndTo(params.accountName, params.toAccountName, params.actionType, response.data.result);
          dispatch(createAccountBySystemSuccessAction(''));
          setTimeout(() => {
            dispatch(getAccountInfo([params.toAccountName])).then(resp => {
              if (resp.hasOwnProperty("result")) {
                dispatch(bindAccountPublicKey([resp.result.accountName]));
              } 
            });
          }, 3000);
        } else {
          dispatch(createAccountBySystemFailAction(response.data.error.message));
        }
      } else {
        dispatch(createAccountBySystemFailAction(response.status));
      }
      return response.data;
    } catch (error) {
      dispatch(createAccountBySystemFailAction(error));
    }
   }
}

export const getAccountInfo = (params) => {
  return async (dispatch) => {
    dispatch(getAccountInfoAction());
    try {
      const response = await getAccountInfoReq(params);
      if (response.data.hasOwnProperty("result")) {
        dispatch(getAccountInfoSuccessAction(response.data.result));
      } else if (response.data.hasOwnProperty("error")) {
        dispatch(getAccountInfoFailAction(response.data.error.message));
      }
      return response.data;
    } catch (error) {
      dispatch(getAccountInfoFailAction(error));
    }
  }
}


export const openDialogOfImportAccount = (params) => {
  return async (dispatch) => {
    dispatch(openImportAccountDialogAction());
  }
}

export const closeDialogOfImportAccount = (params) => {
  return async (dispatch) => {
    dispatch(closeImportAccountDialogAction());
  }
}

export const importAccount = (params) => {
  return async (dispatch) => {
    dispatch(importAccountAction());
    try {
      const response = await getAccountInfoReq(params);
      
      if (response.data.hasOwnProperty("result") && response.data.result != null) {
        dispatch(getAccountInfoSuccessAction(response.data.result));
        dispatch(bindAccountPublicKey([response.data.result.accountName])).then(resp => {
          if (resp.hasOwnProperty("result")) {
            dispatch(importAccountSuccessAction());
          } else if (resp.hasOwnProperty("error")) {
            dispatch(importAccountFailAction(resp.error));
          }
        });
      } else if (response.data.hasOwnProperty("error")) {
        dispatch(getAccountInfoFailAction(response.data.error));
      } else if (response.data.hasOwnProperty("result")) {
        dispatch(getAccountInfoFailAction('Account is not exist.'));
      } 
      return response.data;
    } catch (error) {
      dispatch(importAccountFailAction(error.message));
    }
  }
}

const saveTxHash = (accountName, actionType, txHash) => {
  var txHashSet = cookie.load(accountName);
  if (txHashSet == undefined) {
    txHashSet = [];
  }
  var curDate = new Date().toLocaleString();
  var txHashInfo = {date: curDate, txHash: txHash, actionType: actionType};
  txHashSet = [txHashInfo, ...txHashSet];
  cookie.save(accountName, txHashSet, { path: '/', maxAge: 3600 * 24 * 365 });
}

const saveTxBothFromAndTo = (fromAccount, toAccount, actionType, txHash) => {
  saveTxHash(fromAccount, actionType, txHash);
  if (toAccount != undefined && toAccount != '') {
    saveTxHash(toAccount, actionType, txHash);
  }
}

export const openDialogOfTransfer = (params) => {
  return async (dispatch) => {
    dispatch(openTransferDialogAction());
  }
}

export const closeDialogOfTransfer = (params) => {
  return async (dispatch) => {
    dispatch(closeTransferDialogAction());
  }
}

export const transfer = (params) => {
  return async (dispatch) => {
    dispatch(transferRequestAction());
    try {
      const response = await sendTransaction(params);
      if (response.status == 200) {
        if (response.data.result != null) {
          saveTxBothFromAndTo(params.accountName, params.toAccountName, params.actionType, response.data.result);
          dispatch(transferSuccessAction(response.data.result));
        } else {
          dispatch(transferFailAction(response.data.error.message));
        }
      } else {
        dispatch(transferFailAction(response.status));
      }
      return response.data;
    } catch (error) {
      dispatch(transferFailAction(error.message));
    }
   }
}