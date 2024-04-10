export default [
  {
    path: '',
    name: 'home',
    component: () => import('../modules/inventory/pages/InventoryPage.vue'),
    meta: {
      pageTitle: 'Inventario',
    },
  },
  {
    path: 'inventory',
    name: 'inventory',
    component: () => import('../modules/inventory/pages/InventoryList.vue'),
    meta: {
      pageTitle: 'Inventario',
    },
  },
  {
    path: 'categories',
    name: 'categories',
    component: () => import('../modules/inventory/pages/CategoriesPage.vue'),
    meta: {
      pageTitle: 'Categorías',
    },
  },
  {
    path: 'categories/:id',
    name: 'category',
    component: () => import('../modules/inventory/pages/CategoryPage.vue'),
    meta: {
      pageTitle: 'Categoría',
    },
  },
  {
    path: 'register-category',
    name: 'register-category',
    component: () => import('../modules/inventory/pages/RegisterCategory.vue'),
    meta: {
      pageTitle: 'Registrar categoría',
    },
  },
  {
    path: 'update-category/:idCategory',
    name: 'update-category',
    component: () => import('../modules/inventory/pages/RegisterCategory.vue'),
    meta: {
      pageTitle: 'Editar categoría',
      updatePage: true,
    },
  },
  {
    path: 'register-item',
    name: 'register-item',
    component: () => import('../modules/inventory/pages/RegisterItem.vue'),
    meta: {
      pageTitle: 'Registrar item',
    },
  },
  {
    path: 'item-detail/:id',
    name: 'item-detail',
    component: () => import('../modules/inventory/pages/RegisterItem.vue'),
    meta: {
      pageTitle: 'Item',
    },
  },
]
