// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = [
  // {
  //   name: 'feedback',
  //   path: '',
  //   external: true,
  //   newWindow: true,
  //   icon: 'message',
  // },
  // {
  //   name: '设置节点',
  //   path: '',
  //   external: true,
  //   icon: 'tool',
  // },
];

const asideMenuConfig = [
  {
    name: '概览',
    path: '/dashboard',
    icon: 'home2',
  },
  // {
  //   name: 'Nodes Info',
  //   path: '/chart',
  //   icon: 'chart1',
  //   children: [
  //     {
  //       name: 'Wallet Node',
  //       path: '/page17',
  //       authority: 'admin',
  //     },
  //     {
  //       name: 'Producer Nodes',
  //       path: '/Configure',
  //       authority: 'admin',
  //     },
  //   ],
  // },
  {
    name: '账户管理',
    path: '/table',
    icon: 'table',
    // authority: 'admin',
    children: [
      {
        name: '秘钥',
        path: '/KeystoreManager',
        authority: 'admin',
      },
      {
        name: '账号',
        path: '/AccountManager',
        authority: 'admin',
      },
    ],
  },
  {
    name: '区块 & 交易',
    path: '/list',
    icon: 'ul-list',
    children: [
      {
        name: '区块',
        path: '/Block',
      },
      {
        name: '交易',
        path: '/Transaction',
      },
    ],
  },
  {
    name: '资产管理',
    path: '/portlets',
    icon: 'publish',
    children: [
      {
        name: '资产搜索',
        path: '/assetSearch',
      },
      {
        name: '资产操作',
        path: '/assetOperator',
      },
    ],
  },
];

export { headerMenuConfig, asideMenuConfig };
