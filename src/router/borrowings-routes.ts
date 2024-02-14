export default [
  {
    path: '/borrowings',
    name: 'borrowings',
    component: () => import('../modules/borrowings/pages/BorrowingsListPage.vue'),
    meta: {
      pageTitle: 'Préstamos',
    },
  },
]
