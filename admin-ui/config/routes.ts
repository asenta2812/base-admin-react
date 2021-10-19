export default [
  { path: '/user', layout: false, routes: [{ path: '/user/login', component: './Login' }] },
  {
    path: '/system',
    name: 'admin',
    icon: 'setting',
    access: 'canAdmin',
    // hideInMenu: true,
    routes: [
      { path: '/system', redirect: '/system/user' },
      { path: '/system/user', component: './User', exact: true, name: 'user' },
      { path: '/system/user/add', component: './User/ShareForm', exact: true, name: 'create', hideInMenu: true },
      { path: '/system/role', component: './Role', exact: true, name: 'role' },
    ],
  },
  { path: '/', exact: true, redirect: '/system/user' },
  { layout: false, component: './404' },
];
