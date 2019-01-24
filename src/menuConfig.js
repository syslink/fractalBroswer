// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = [
  {
    name: '反馈',
    path: 'https://github.com/alibaba/ice',
    external: true,
    newWindow: true,
    icon: 'message',
  },
  {
    name: '帮助',
    path: 'https://alibaba.github.io/ice',
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
    name: '节点管理',
    path: '/chart',
    icon: 'chart1',
    children: [
      {
        name: '性能监控',
        path: '/page17',
        authority: 'admin',
      },
      {
        name: '配置管理',
        path: '/Configure',
        authority: 'admin',
      },
      {
        name: '账户管理',
        path: '/AccountManager',
        authority: 'admin',
      },
    ],
  },
  {
    name: '节点测试',
    path: '/table',
    icon: 'table',
    // authority: 'admin',
    children: [
      {
        name: '基础测试',
        path: '/table/basic-table',
        authority: 'admin',
      },
    ],
  },
  {
    name: '区块&交易',
    path: '/list',
    icon: 'ul-list',
    children: [
      {
        name: '查看区块',
        path: '/Block',
      },
      {
        name: '查看交易',
        path: '/Transaction',
      },
      {
        name: '查看挂起中的交易',
        path: '/list/card-list',
      },
      {
        name: '查看合约内部交易',
        path: '/list/card-list1',
      },
    ],
  },
  {
    name: '资产管理',
    path: '/portlets',
    icon: 'publish',
    children: [
      {
        name: '资产查询',
        path: '/assetSearch',
      },
      {
        name: '资产操作',
        path: '/assetOperator',
      },
    ],
  },
  {
    name: '合约管理',
    path: '/result',
    icon: 'result',
    children: [
      {
        name: '编写合约',
        path: '/contractManager',
      },
      {
        name: '查看合约',
        path: '/result/fail',
      },
    ],
  },
];

export { headerMenuConfig, asideMenuConfig };
