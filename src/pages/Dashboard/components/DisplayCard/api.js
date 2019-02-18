import axios from 'axios';

export async function getLatestBlockReq(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                    "method": "", 
                                    "params": params,
                                    "id": 1});
  return axios({
    url: 'http://127.0.0.1:8545',
    method: 'post',
    data: dataToSrv,
  });
}

export async function getTransactionsNumReq(params) {
  var dataToSrv = JSON.stringify({"jsonrpc": "2.0", 
                                    "method": "", 
                                    "params": params,
                                    "id": 1});
  return axios({
    url: 'http://127.0.0.1:8545',
    method: 'post',
    data: dataToSrv,
  });
}

export default {
  getLatestBlockReq,
  getTransactionsNumReq,
};