// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = [
  {
    name: 'feedback',
    path: '',
    external: true,
    newWindow: true,
    icon: 'message',
  },
  {
    name: 'help',
    path: '',
    external: true,
    newWindow: true,
    icon: 'bangzhu',
  },
];

const asideMenuConfig = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'home2',
  },
  {
    name: 'Nodes Info',
    path: '/chart',
    icon: 'chart1',
    children: [
      {
        name: 'Wallet Node',
        path: '/page17',
        authority: 'admin',
      },
      {
        name: 'Producer Nodes',
        path: '/Configure',
        authority: 'admin',
      },
    ],
  },
  {
    name: 'Account Manager',
    path: '/table',
    icon: 'table',
    // authority: 'admin',
    children: [
      {
        name: 'Keystore',
        path: '/KeystoreManager',
        authority: 'admin',
      },
      {
        name: 'Account',
        path: '/AccountManager',
        authority: 'admin',
      },
    ],
  },
  {
    name: 'Block & Transaction',
    path: '/list',
    icon: 'ul-list',
    children: [
      {
        name: 'Block',
        path: '/Block',
      },
      {
        name: 'Transaction',
        path: '/Transaction',
      },
    ],
  },
  {
    name: 'Asset Manager',
    path: '/portlets',
    icon: 'publish',
    children: [
      {
        name: 'Asser Search',
        path: '/assetSearch',
      },
      {
        name: 'Asset Operator',
        path: '/assetOperator',
      },
    ],
  },
  {
    name: 'Contract Manager',
    path: '/result',
    icon: 'result',
    children: [
      {
        name: 'Contract Editor',
        path: '/contractManager',
      },
      {
        name: 'Contract Viewer',
        path: '/result/fail',
      },
    ],
  },
];

export { headerMenuConfig, asideMenuConfig };
