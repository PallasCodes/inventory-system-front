export default [
  {
    path: '',
    name: 'home',
    component: () => import('../modules/inventory/pages/InventoryPage.vue'),
  },
  {
    path: 'inventory',
    name: 'inventory',
    component: () => import('../modules/inventory/pages/InventoryList.vue'),
  },
  {
    path: 'categories',
    name: 'categories',
    component: () => import('../modules/inventory/pages/CategoriesPage.vue'),
  },
  {
    path: 'categories/:id',
    name: 'category',
    component: () => import('../modules/inventory/pages/CategoryPage.vue'),
  },
  {
    path: 'register-category',
    name: 'register-category',
    component: () => import('../modules/inventory/pages/RegisterCategory.vue'),
  },
  {
    path: 'register-item',
    name: 'register-item',
    component: () => import('../modules/inventory/pages/RegisterItem.vue'),
  },
  {
    path: 'item-detail/:id',
    name: 'item-detail',
    component: () => import('../modules/inventory/pages/RegisterItem.vue'),
  },
]
