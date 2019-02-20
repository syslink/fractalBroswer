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
} from './constants';

const initialState = {
  isLoading: false,
  accountNames: ['ftsystemio'],
  keystoreInfo: [],
};

function blockTrxReducer(state = initialState, action) {
  switch (action.type) {
    case BIND_ACCOUNT_REQUEST:
      return Object.assign({}, state, {
      });
    case BIND_ACCOUNT_SUCCESS:
      return Object.assign({}, state, {
        blockInfo: action.payload,
      });
    case BIND_ACCOUNT_FAILURE:
      return Object.assign({}, state, {
        errorInfo: action.payload,
      });

    case UPDATE_BOUND_REQUEST:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    case UPDATE_BOUND_SUCCESS:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        txNum: action.payload,
      });
    case UPDATE_BOUND_FAILURE:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });

    case DELETE_BOUND_REQUEST:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    case DELETE_BOUND_SUCCESS:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        txNum: action.payload,
      });
    case DELETE_BOUND_FAILURE:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });

    case GET_BOUND_REQUEST:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    case GET_BOUND_SUCCESS:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        accountNames: [...state.accountNames, action.payload],
      });
    case GET_BOUND_FAILURE:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });

    case GET_KEYSTORE_REQUEST:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    case GET_KEYSTORE_SUCCESS:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        keystoreInfo: action.result,
      });
    case GET_KEYSTORE_FAILURE:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });

    case CREATE_ACCOUNT_BY_SYSTEM_REQUEST:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    case CREATE_ACCOUNT_BY_SYSTEM_SUCCESS:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        createAccountResult: action.result,
      });
    case CREATE_ACCOUNT_BY_SYSTEM_FAILURE:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        createAccountResult: action.result,
      })

    case GET_ACCOUNT_INFO_REQUEST:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    case GET_ACCOUNT_INFO_SUCCESS:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        accountInfo: action.result,
      });
    case GET_ACCOUNT_INFO_FAILURE:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        accountInfo: '',
      })
    default:
      return state;
  }
}

export default blockTrxReducer;