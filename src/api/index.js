import axios from 'axios';

import cookie from 'react-cookies'

export async function getCurrentBlock(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "ft_getCurrentBlock", 
                                  "params": params,
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}

export async function getBlockByHash(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "ft_getBlockByHash", 
                                  "params": params,
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}

export async function getBlockByNum(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "ft_getBlockByNumber", 
                                  "params": params,
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}

export async function getTransactionByHash(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "ft_getTransactionByHash", 
                                  "params": params,
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}

export async function getTransactionReceipt(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "ft_getTransactionReceipt", 
                                  "params": params,
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}

export async function getTxNumByBlockHash(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "ft_getTxNumByBlockHash", 
                                  "params": params,
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}

export async function getTxNumByBlockNum(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "ft_getTxNumByBlockNum", 
                                  "params": params,
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}



export async function getTotalTxNumByBlockHash(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "ft_getTotalTxNumByBlockHash", 
                                  "params": params,
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}

export async function getTotalTxNumByBlockNum(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "ft_getTotalTxNumByBlockNum", 
                                  "params": params,
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}


export async function getProducers() {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "dpos_producers", 
                                  "params": [],
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}


export async function getDposAccountInfo(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "dpos_account", 
                                  "params": params,
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}


export async function getDposInfo(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                    "method": "dpos_info", 
                                    "params": [],
                                    "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}

export async function getDposIrreversibleInfo(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "dpos_irreversible", 
                                  "params": params,
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}

export async function getAssetInfoById(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "account_getAssetInfoByID", 
                                  "params": params,
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}

export async function getAssetInfoByName(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "account_getAssetInfoByName", 
                                  "params": params,
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}

export async function getSuggestionGasPrice() {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "ft_gasPrice", 
                                  "params": [],
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}

export async function getValidateEpchoInfo() {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "dpos_validateEpcho", 
                                  "params": [],
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}

export async function getLatestEpchoInfo() {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "dpos_latestEpcho", 
                                  "params": [],
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}

export async function getNonce(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "account_getNonce", 
                                  "params": params,
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}

export async function sendTransaction(params) {
  var resp = await getNonce([params.accountName]);
  var chainId = 1;
  var chainIdCookie = cookie.load("chainId");
  if (chainIdCookie != null && chainIdCookie != '') {
    chainId = chainIdCookie;
  }
  chainId = parseInt(chainId);

  var basicInfo = {"actionType":params.actionType, 
                   "chainID":chainId, 
                   "gasAssetId":1, 
                   "from":params.accountName, 
                   "to":params.toAccountName == undefined ? '' : params.toAccountName, 
                   "nonce":resp.data.result, 
                   "assetId":params.assetId == undefined ? 1 : params.assetId, 
                   "gas":params.gasLimit == undefined ? 200000 : params.gasLimit, 
                   "gasPrice":params.gasPrice == undefined ? 10 : params.gasPrice, 
                   "value":params.value == undefined ? 0 : params.value, 
                   "data":params.data == undefined ? '' : params.data, 
                   "password":params.password}
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "ft_sendTransaction", 
                                  "params": [basicInfo],
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}

export async function signTx(params) {
  var resp = await getNonce([params.accountName]);

  var actions = [];
	var gasAssetID = 1;
	var gasPrice = params.gasPrice == undefined ? 10 : params.gasPrice

  // for(let action of params.actions) {
  //   AType    ActionType
  //   Nonce    uint64
  //   AssetID  uint64
  //   From     common.Name
  //   To       common.Name
  //   GasLimit uint64
  //   Amount   *big.Int
  //   Payload  []byte
  // }
}
export async function transfer(params) {
  var resp = await signTx([params]);
  var chainId = 1;
  var chainIdCookie = cookie.load("chainId");
  if (chainIdCookie != null && chainIdCookie != '') {
    chainId = chainIdCookie;
  }
  chainId = parseInt(chainId);

  var basicInfo = {"actionType":params.actionType, 
                   "chainID":chainId, 
                   "gasAssetId":1, 
                   "from":params.accountName, 
                   "to":params.toAccountName == undefined ? '' : params.toAccountName, 
                   "nonce":resp.data.result, 
                   "assetId":params.assetId == undefined ? 1 : params.assetId, 
                   "gas":params.gasLimit == undefined ? 200000 : params.gasLimit, 
                   "gasPrice":params.gasPrice == undefined ? 10 : params.gasPrice, 
                   "value":params.value == undefined ? 0 : params.value, 
                   "data":params.data == undefined ? '' : params.data, 
                   "password":params.password}
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "ft_sendRawTransaction", 
                                  "params": [basicInfo],
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}

export async function getAccountInfo(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "account_getAccountByName", 
                                  "params": params,
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}
export async function isAccountExist(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                  "method": "account_accountIsExist", 
                                  "params": params,
                                  "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}

export async function getBoundInfo(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                    "method": "keystore_getAccountsByPublicKeys", 
                                    "params": params,
                                    "id": 1});
  return axios({
    method: 'post',
    data: dataToSrv,
  });
}

export default {
  getCurrentBlock,
  getBlockByHash,
  getBlockByNum,
  getTransactionByHash,
  getTransactionReceipt,
  getTxNumByBlockHash,
  getTxNumByBlockNum,
  getTotalTxNumByBlockHash,
  getTotalTxNumByBlockNum,
  getProducers,
  getDposAccountInfo,
  getDposIrreversibleInfo,
  getDposInfo,
  sendTransaction,
  getValidateEpchoInfo,
  getAccountInfo,
  getBoundInfo
};
