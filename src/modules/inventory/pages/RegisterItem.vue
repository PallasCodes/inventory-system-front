<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Loading, useQuasar } from 'quasar'

import { Category } from '../interfaces/Category'
import { CategoryService } from 'src/api/category.api'
import SingleItemStore from '../stores/single-item-store'
import { ItemService } from 'src/api/item.api'

import SingleItemsList from '../components/SingleItemsList.vue'
import { useRouter } from 'vue-router'

// TODO: add autocomplete for categories

const $q = useQuasar()
const router = useRouter()

interface FormData {
  name: string
  description: string
  // imgFiles: []
  categoriesIds: { id: string; name: string }[]
  amount: number
}

const formData = ref<FormData>({
  name: '',
  description: '',
  // imgFiles: [],
  categoriesIds: [],
  amount: 1,
})

const categories = ref<Category[]>([])

const registerItem = async () => {
  Loading.show()
  const payload = {
    ...formData.value,
    categoriesIds: formData.value.categoriesIds.map((category) => category.id),
    singleItems: SingleItemStore.store,
  }
  await ItemService.create(payload)
  Loading.hide()
  $q.notify({
    color: 'green',
    textColor: 'white',
    icon: 'check',
    message: 'Item registrado con éxito',
  })
  router.replace('/')
}

onMounted(async () => {
  const { data } = await CategoryService.findAll()
  categories.value = data
})
</script>

<template>
  <q-page class="q-mx-lg q-py-md">
    <div class="row q-col-gutter-lg">
      <div class="col-4">
        <q-card class="q-pa-sm">
          <q-card-section>
            <q-form @submit.prevent="registerItem">
              <div class="row q-gutter-sm">
                <div class="col-12">
                  <span
                    class="block text-subtitle2"
                    style="font-size: 16px !important; color: #222 !important"
                    >Registrar item</span
                  >
                </div>
                <div class="col-12">
                  <q-input
                    v-model="formData.name"
                    type="text"
                    label="Nombre"
                    @update:model-value="SingleItemStore.setItemName"
                  />
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
                  <q-select
                    v-model="formData.categoriesIds"
                    :options="categories"
                    label="Categorías"
                    multiple
                    use-chips
                    option-value="id"
                    option-label="name"
                  ></q-select>
                </div>
                <!-- <div class="col-12">
                  <q-file
                    v-model="formData.imgFiles"
                    label="Imágenes"
                    multiple
                    accept=".jpg, .png, .jpeg, image/*"
                  >
                    <template v-slot:append>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </div> -->
                <div class="col-12">
                  <q-input
                    type="number"
                    v-model.number.lazy="formData.amount"
                    min="1"
                    max="20"
                    label="Cantidad"
                    @update:model-value="SingleItemStore.updateStore"
                  ></q-input>
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
      </div>

      <div class="col-3">
        <q-form @submit.prevent>
          <q-scroll-area style="height: calc(100vh - 98px)">
            <SingleItemsList :single-items-amount="formData.amount" />
          </q-scroll-area>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<style>
.q-field__label {
  font-size: 14px !important;
}
</style>
