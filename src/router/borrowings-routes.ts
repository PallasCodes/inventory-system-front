export default [
  {
    path: '/borrowings',
    name: 'borrowings',
    component: () => import('../modules/borrowings/pages/BorrowingsListPage.vue'),
    meta: {
      pageTitle: 'Préstamos',
    },
  },
  {
    path: '/register-borrowing',
    name: 'registerBorrowing',
    component: () => import('../modules/borrowings/pages/RegisterBorrowing.vue'),
    meta: {
      pageTitle: 'Registrar préstamo',
    },
  },
  {
    path: '/register-return',
    name: 'registerReturn',
    component: () => import('../modules/borrowings/pages/RegisterReturnPage.vue'),
    meta: {
      pageTitle: 'Registrar entrega',
    },
  },
]
