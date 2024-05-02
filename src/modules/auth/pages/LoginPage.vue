<script setup lang="ts">
import { ref } from 'vue'
import { QForm } from 'quasar'

import { useLoginUser } from '../composables/login.composable'
import { useRouter } from 'vue-router'
const router = useRouter()

const email = ref<string>()
const password = ref<string>()

const loginForm = ref(null)

const login = async () => {
  const validCredentials = await useLoginUser(
    email.value as string,
    password.value as string,
  )

  if (validCredentials) router.replace('/')
}
</script>

<template>
  <q-layout>
    <q-page-container>
      <div class="row justify-center items-center" style="min-height: 100vh">
        <div class="col-10 col-md-6">
          <span class="text-center text-h4 q-mb-lg block">Gestor de Inventario</span>
          <q-card style="width: 100%; max-width: 420px" class="q-mx-auto q-pa-sm">
            <q-card-section>
              <span class="text-h6 q-mb-sm">Login</span>
              <q-form @submit.prevent="login" ref="loginForm">
                <div class="row">
                  <div class="col-12">
                    <q-input
                      v-model="email"
                      label="Email"
                      type="email"
                      :rules="[
                        (val) => (val && val.length > 0) || 'Please type something',
                      ]"
                    ></q-input>
                  </div>
                  <div class="col-12">
                    <q-input
                      v-model="password"
                      label="Contraseña"
                      type="password"
                      :rules="[
                        (val: string) => (val && val.length > 0) || 'Please type something',
                      ]"
                    ></q-input>
                  </div>
                  <div class="col-12">
                    <q-btn
                      type="Submit"
                      color="primary"
                      class="q-mt-md full-width"
                      :rules="[
                        (val: string) => (val && val.length > 0) || 'Please type something',
                      ]"
                      >Iniciar sesión</q-btn
                    >
                  </div>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>
