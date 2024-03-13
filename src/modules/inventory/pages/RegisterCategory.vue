<script setup lang="ts">
import { Loading, useQuasar } from 'quasar'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { CategoryService } from 'src/api/category.api'
import { handleRequest } from 'src/utils/handleRequest'
import { makeAPICall } from 'src/utils/imgBb'

const $q = useQuasar()
const router = useRouter()

interface RegisterCategoryForm {
  name: string | null
  description?: string | null
  imgFile?: File | null
  imgUrl?: string | null
}

const formData = ref<RegisterCategoryForm>({
  name: null,
  description: null,
  imgFile: null,
  imgUrl: null,
})

const registerCategory = async () => {
  Loading.show()

  const formPayload = new FormData()

  formPayload.append('name', 'category_' + formData.value.name)
  formPayload.append('image', formData.value.imgFile as File)
  formPayload.append('key', '984cd4fb80b1dece88ef94d4ab376823')

  try {
    const { data: apiData } = await makeAPICall({
      image: formData.value.imgFile,
      name: 'category_' + formData.value.name,
    })

    formData.value.imgUrl = apiData.data.thumb.url
    delete formData.value.imgFile

    const { error, message } = await handleRequest(CategoryService.create, formData.value)

    Loading.hide()
    message?.display()

    if (!error) router.replace({ name: 'categories' })
  } catch (error) {
    console.log(error)
  }

  // TODO: use env var for key
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
