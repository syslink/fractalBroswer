import pathToRegexp from 'path-to-regexp';

import cookie from 'react-cookies'
import BigNumber from 'bignumber.js';
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
  var pos = 0;
  var len = str.length;

  if(str[0] == '0' && str[1] == 'x') {
    pos = 2;
    len -= 2;
  }
  if(len % 2 != 0)
  {
      return null; 
  }

  len /= 2;
  var hexA = new Array();
  for(var i = 0; i < len; i++)
  {
    var s = str.substr(pos, 2);
    var v = parseInt(s, 16);
    hexA.push(v);
    pos += 2;
  }
  return hexA;
}

function str2Bytes(str) {
  var bytes = [];
  for (var i = 0; i < str.length; ++i) {
    var code = str.charCodeAt(i);
    code = code - 48;
    bytes = bytes.concat([code]);
  }
  return bytes;
}

function bytes2Hex(array) {
  var hexStr = '0x';
  array.map((item) => {
    var hex = item.toString(16);
    if (hex.length == 1) {
      hex = '0' + hex;
    }
    hexStr += hex;
  });
  return hexStr;
}
// 每个byte里存放的是二进制数据，从高位依次到低位
function bytes2Number(bytes) {
  var len = bytes.length;
  var number = new BigNumber(0);
  for (var i = len - 1; i >= 0; i--) {
    var byteValue = new BigNumber(bytes[i]);
    var factor = new BigNumber(2).pow((len - 1 - i) * 8);
    number = number.plus(byteValue.multipliedBy(factor));
  }
  return number;
}

function saveTxHash(accountName, actionType, txHash) {
  var txHashSet = cookie.load(accountName);
  if (txHashSet == undefined) {
    txHashSet = [];
  }
  var curDate = new Date().toLocaleString();
  var txHashInfo = {date: curDate, txHash: txHash, actionType: actionType};
  txHashSet = [txHashInfo, ...txHashSet];
  cookie.save(accountName, txHashSet, { path: '/', maxAge: 3600 * 24 * 365 });
}

function saveTxBothFromAndTo(fromAccount, toAccount, actionType, txHash) {
  saveTxHash(fromAccount, actionType, txHash);
  if (toAccount != undefined && toAccount != '') {
    saveTxHash(toAccount, actionType, txHash);
  }
}

export { getFlatMenuData, getRouterData, formatterMenuData, hex2Bytes, bytes2Hex, str2Bytes, saveTxHash, saveTxBothFromAndTo, bytes2Number };
