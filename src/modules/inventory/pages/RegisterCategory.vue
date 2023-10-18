<script setup lang="ts">
import { Loading, useQuasar } from 'quasar'
import { CategoryService } from 'src/api/category.api'
import { handleRequest } from 'src/utils/handleRequest'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

interface RegisterCategoryForm {
  name: string
  description?: string
  imgFile?: File
}

const formData = ref<RegisterCategoryForm>({
  name: '',
  description: '',
})

const registerCategory = async () => {
  Loading.show()

  await handleRequest(CategoryService.create, { ...formData.value })

  Loading.hide()

  $q.notify({
    color: 'green',
    textColor: 'white',
    icon: 'check',
    message: 'Categoría registrada con éxito',
  })
  router.replace({ name: 'categories' })
}
</script>

<template>
  <q-page class="q-mx-lg q-py-md">
    <q-card style="max-width: 500px; width: 100%" class="q-pa-md">
      <q-card-section>
        <q-form @submit.prevent="registerCategory">
          <div class="row q-gutter-sm">
            <div class="col-12">
              <span
                class="block text-subtitle2"
                style="font-size: 16px !important; color: #222 !important"
                >Registrar categoría</span
              >
            </div>
            <div class="col-12">
              <q-input v-model="formData.name" type="text" label="Nombre" />
            </div>
            <div class="col-12">
              <q-input
                v-model="formData.description"
                type="textarea"
                label="Descripción"
                autogrow
                :rows="3"
              ></q-input>
            </div>
            <div class="col-12">
              <q-file
                v-model="formData.imgFile"
                label="Imagen"
                :multiple="false"
                accept=".jpg, .png, .jpeg, image/*"
              >
                <template v-slot:append>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
            <div class="col-12">
              <q-btn type="submit" color="green" class="q-mt-md" size="md"
                >Registrar</q-btn
              >
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style>
.q-field__label {
  font-size: 14px !important;
}
</style>
