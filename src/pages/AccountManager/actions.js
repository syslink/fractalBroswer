import {bindAccountAddrReq, 
        updateBoundInfoReq, 
        deleteBoundInfoReq, 
        getBoundInfoReq, 
        getKeystoreReq, 
        createAccountBySystemReq} from './api';

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

  CREATE_ACCOUNT_BY_SYSTEM_REQUEST,
  CREATE_ACCOUNT_BY_SYSTEM_SUCCESS,
  CREATE_ACCOUNT_BY_SYSTEM_FAILURE,

  GET_ACCOUNT_INFO_REQUEST,
  GET_ACCOUNT_INFO_SUCCESS,
  GET_ACCOUNT_INFO_FAILURE,

  RPC_REQUEST_FAILURE,
} from './constants';


const bindAccountAddrAction = () => {
  return {
    type: BIND_ACCOUNT_REQUEST
  };
};

const bindAccountAddrSuccessAction = (payload) => {
  return {
    type: BIND_ACCOUNT_SUCCESS,
    result: payload,
  };
};

const  bindAccountAddrFailAction = (payload) => {
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

const createAccountBySystemAction = () => {
  return {
    type: CREATE_ACCOUNT_BY_SYSTEM_REQUEST,
    isLoading: true,
  };
};

const createAccountBySystemSuccessAction = (payload) => {
  return {
    type: CREATE_ACCOUNT_BY_SYSTEM_SUCCESS,
    result: payload,
    isLoading: false,
  };
};

const createAccountBySystemFailAction = (payload) => {
  return {
    type: CREATE_ACCOUNT_BY_SYSTEM_FAILURE,
    result: payload,
    isLoading: false,
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

export const bindAccountAddr = (params) => {
  return async (dispatch) => {
    dispatch(bindAccountAddrAction());
    try {
      const response = await bindAccountAddrReq(params);
      if (response.data.hasOwnProperty("result")) {
          dispatch(bindAccountAddrSuccessAction(response.data.result));
      } else if (response.data.hasOwnProperty("error")) {
        dispatch(bindAccountAddrFailAction(response.data.error));
      }
      return response.data;
    } catch (error) {
      dispatch(bindAccountAddrFailAction(error));
    }
  }
}

export const deleteBoundInfo = (params) => {
  return async (dispatch) => {
    dispatch(deleteBoundInfoAction());
    try {
      const response = await deleteBoundInfoReq(params);
      if (response.data.hasOwnProperty("result")) {
        dispatch(deleteBoundInfoSuccessAction(response.data.result));
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

export const getKeystore = (params) => {
  return async (dispatch) => {
    dispatch(getKeystoreAction());
    try {
      const response = await getKeystoreReq(params);
      if (response.data.hasOwnProperty("result")) {
        dispatch(getKeystoreSuccessAction(response.data.result));
      } else if (response.data.hasOwnProperty("error")) {
        dispatch(getKeystoreFailAction(response.data.error));
      }
      return response.data;
    } catch (error) {
      dispatch(getKeystoreFailAction(error));
    }
  }
}

export const createAccountBySystem = (params) => {
  return async (dispatch) => {
    dispatch(createAccountBySystemAction());
    try {
      const response = await createAccountBySystemReq(params);
      if (response.status == 200) {
        if (response.data.code == 0) {
          dispatch(createAccountBySystemSuccessAction('')).then(
            resp => (getAccountInfo(resp))
          );
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

export const getAccountInfo = (params) => {
  return async (dispatch) => {
    dispatch(getAccountInfoAction());
    try {
      const response = await getAccountInfoReq(params);
      if (response.data.hasOwnProperty("result")) {
        dispatch(getAccountInfoSuccessAction(response.data.result));
      } else if (response.data.hasOwnProperty("error")) {
        dispatch(getAccountInfoFailAction(response.data.error));
      }
      return response.data;
    } catch (error) {
      dispatch(getAccountInfoFailAction(error));
    }
  }
}


