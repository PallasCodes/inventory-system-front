<template>
  <q-layout view="lHh lpR lFf">
    <q-header id="navbar" class="q-pa-sm">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> {{ routeStore.getPageTitle }} </q-toolbar-title>
        <q-btn round flat icon="settings">
          <q-menu>
            <q-list>
              <q-item clickable dense>
                <q-item-section style="font-size: 12px" class="q-py-sm"
                  >Cambiar contraseña</q-item-section
                >
              </q-item>
              <q-item clickable dense>
                <q-item-section style="font-size: 12px" class="q-py-sm" @click="logout"
                  >Cerrar sesión</q-item-section
                >
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      dark
      id="left-drawer"
      style="box-shadow: rgba(90, 90, 104, 0.4) 16px 0px 38px 12px !important"
    >
      <div>
        <span class="text-h6 q-pa-lg block">INVENTARIO IM</span>
      </div>
      <q-list id="drawer" class="q-pl-sm">
        <div class="q-px-md q-pb-xs text-grey-5">
          <span class="block font-weight-medium">Inventario</span>
        </div>
        <q-item
          :to="{ name: 'home' }"
          class="nav-item"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Inventario</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          to="/categories"
          class="nav-item"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="category" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Categorías</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          :to="{ name: 'register-item' }"
          class="nav-item"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="add_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Registrar item</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          :to="{ name: 'register-category' }"
          class="nav-item"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="add_box" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Registrar categoría</q-item-label>
          </q-item-section>
        </q-item>

        <div class="q-px-md q-pb-xs q-pt-md text-grey-5">
          <span class="block font-weight-medium">Préstamos</span>
        </div>
        <q-item
          :to="{ name: 'login' }"
          class="nav-item"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="real_estate_agent" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Préstamos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/login" class="nav-item" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="receipt_long" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Registrar préstamo</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          :to="{ name: 'inventory' }"
          class="nav-item"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="receipt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Registrar entrega</q-item-label>
          </q-item-section>
        </q-item>

        <div class="q-px-md q-pb-xs q-pt-md text-grey-5">
          <span class="block font-weight-medium">Empleados</span>
        </div>
        <q-item
          :to="{ name: 'employees' }"
          class="nav-item"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Empleados</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          to="/register-employee"
          class="nav-item"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="person_add" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Registrar empleado</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          :to="{ name: 'registerDept' }"
          class="nav-item"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="room_preferences" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Registrar departamento</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container id="page-container">
      <q-scroll-area style="height: calc(100vh - 66px); width: 100%">
        <q-page class="q-mx-xl q-py-md">
          <router-view />
        </q-page>
      </q-scroll-area>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { useLogoutUser } from 'src/modules/auth/composables/login.composable'
import { useRouter } from 'vue-router'
import { useRouteStore } from 'src/stores/routes-store'

const routeStore = useRouteStore()

const router = useRouter()

const leftDrawerOpen = ref<boolean>(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function logout() {
  useLogoutUser()
  router.replace({ name: 'login' })
}
</script>

<style>
#page-container {
  background: #fafafa;
}

#navbar {
  background: transparent;
  color: #222;
}

#drawer .q-item:hover {
  border-right: 6px solid #1976d2;
}

#drawer .q-item:hover .q-item__label,
#drawer .q-item:hover i {
  color: #1976d2 !important;
}

#drawer .q-router-link--exact-active {
  border-right: 6px solid #1976d2 !important;
  color: #1976d2 !important;
}

#drawer a .q-item__label {
  font-weight: 500 !important;
}

#left-drawer {
  background-color: #0f172a;
}
</style>
