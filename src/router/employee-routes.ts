export default [
  {
    path: '/register-employee',
    name: 'Register employee',
    component: () => import('../modules/employees/pages/RegisterEmployeePage.vue'),
    meta: {
      pageTitle: 'Registrar empleado',
    },
  },
  {
    path: '/register-department',
    name: 'registerDept',
    component: () => import('../modules/employees/pages/RegisterDeptPage.vue'),
    meta: {
      pageTitle: 'Registrar departamento',
    },
  },
]
