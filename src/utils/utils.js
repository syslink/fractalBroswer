/* eslint-disable prefer-template */
import pathToRegexp from 'path-to-regexp';

import BigNumber from 'bignumber.js';
import EthCrypto from 'eth-crypto';
/**
 * 格式化菜单数据结构，如果子菜单有权限配置，则子菜单权限优先于父级菜单的配置
 * 如果子菜单没有配置，则继承自父级菜单的配置
 * @param {Array} menuData
 * @param {String} parentPath
 * @param {string} parentAuthority
 */
function formatterMenuData(menuData, parentPath = '', parentAuthority) {
  return menuData.map((item) => {
    const { path } = item;
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatterMenuData(
        item.children,
        `${parentPath}${item.path}`,
        item.authority
      );
    }
    return result;
  });
}

/**
 * 将 Array 结构的 Menu 数据转化成以 path 为 key 的 Object 结构
 * 扁平化 Menu 数据，通过递归调用将父子层结构的数据处理为扁平化结构
 * @param {array} menuConfig
 *
 * eg：
 *  "/dashboard": {name: "dashboard", icon: "dashboard", path: "/dashboard", children: Array(3), authority: undefined}
 *  "/form": {name: "表单页", icon: "form", path: "/form", children: Array(3), authority: undefined}
 *  "/list": {name: "列表页", icon: "table", path: "/list", children: Array(4), authority: undefined}
 */
function getFlatMenuData(menuConfig) {
  let keys = {};
  menuConfig.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

/**
 *
 * @param {Array}  routerConfig
 * @param {Object} menuConfig
 */
function getRouterData(routerConfig, menuConfig) {
  const menuData = getFlatMenuData(formatterMenuData(menuConfig));

  const routerData = [];

  routerConfig.forEach((item, index) => {
    // 匹配菜单中的路由，当路由的 path 能在 menuData 中找到匹配（即菜单项对应的路由），则获取菜单项中当前 path 的配置 menuItem
    // eg.  router /product/:id === /product/123
    const pathRegexp = pathToRegexp(item.path);
    const menuKey = Object.keys(menuData).find((key) =>
      pathRegexp.test(`${key}`)
    );

    let menuItem = {};
    if (menuKey) {
      menuItem = menuData[menuKey];
    }

    let router = routerConfig[index];
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };

    routerData.push(router);
  });

  return routerData;
}

function hex2Bytes(str) {
  let pos = 0;
  let len = str.length;
  let hexA = new Uint8Array();

  if (str[0] === '0' && (str[1] === 'x' || str[1] === 'X')) {
    pos = 2;
    len -= 2;
  }
  if (len === 0) {
    return hexA;
  }
  if (len % 2 !== 0) {
    if (pos === 0) {
      str = '0' + str;
    } else {
      str = str.substr(0, pos) + '0' + str.substr(pos);
      len += 1;
    }
  }

  len /= 2;
  hexA = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    const s = str.substr(pos, 2);
    const v = parseInt(s, 16);
    hexA[i] = v;
    pos += 2;
  }
  return hexA;
}

function str2Bytes(str) {
  let bytes = [];
  for (let i = 0; i < str.length; i += 1) {
    let code = str.charCodeAt(i);
    code -= 48;
    bytes = bytes.concat([code]);
  }
  return bytes;
}

function bytes2Hex(array) {
  let hexStr = '0x';
  array.map((item) => {
    let hex = item.toString(16);
    if (hex.length === 1) {
      hex = '0' + hex;
    }
    hexStr += hex;
    return hex;
  });
  return hexStr;
}
// 每个byte里存放的是二进制数据，从高位依次到低位
function bytes2Number(bytes) {
  const len = bytes.length;
  let number = new BigNumber(0);
  for (let i = len - 1; i >= 0; i -= 1) {
    const byteValue = new BigNumber(bytes[i]);
    const factor = new BigNumber(2).pow((len - 1 - i) * 8);
    number = number.plus(byteValue.multipliedBy(factor));
  }
  return number;
}

function saveTxHash(accountName, actionType, txHash) {
  let txHashSet = global.localStorage.getItem(accountName);
  if (txHashSet === undefined) {
    txHashSet = [];
  } else {
    txHashSet = JSON.parse(txHashSet);
  }
  const curDate = new Date().toLocaleString();
  const txHashInfo = { date: curDate, txHash, actionType };
  txHashSet = [txHashInfo, ...txHashSet];
  global.localStorage.setItem(accountName, JSON.stringify(txHashSet));
}

function saveTxBothFromAndTo(fromAccount, toAccount, actionType, txHash) {
  saveTxHash(fromAccount, actionType, txHash);
  if (toAccount !== undefined && toAccount !== '') {
    saveTxHash(toAccount, actionType, txHash);
  }
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function checkPassword(password) {//必须为字母加数字且长度不小于8位
  var str = password;
   if (str == null || str.length <8) {
       return false;
   }
   var reg1 = new RegExp(/^[0-9A-Za-z]+$/);
   if (!reg1.test(str)) {
       return false;
   }
   var reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
   if (reg.test(str)) {
       return true;
   } else {
       return false;
   }
}

function parsePrivateKey(privateKey) {
  if (!ethUtil.isValidPrivate(Buffer.from(hex2Bytes(privateKey)))) {
    Feedback.toast.error('无效私钥！');
    return;
  }
  const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);
  console.log('私钥：' + privateKey);
  console.log('公钥：' + publicKey);
  console.log('地址：' + EthCrypto.publicKey.toAddress(publicKey));
  //const bs58 = require('bs58');
  //console.log(bs58.decode('EeGCnq9vgtb8qQ1XzLxF7g3w7XxrwrDUTz').toString('hex'));
  
}
export { getFlatMenuData, getRouterData, formatterMenuData, hex2Bytes, bytes2Hex, str2Bytes, 
         saveTxHash, saveTxBothFromAndTo, bytes2Number, deepClone, parsePrivateKey, checkPassword };
