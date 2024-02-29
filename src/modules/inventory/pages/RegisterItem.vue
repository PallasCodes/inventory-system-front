<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Loading, QForm, QStepper, useQuasar } from 'quasar'

import { Category } from '../interfaces/Category'
import SingleItemStore, { SingleItem } from '../stores/single-item-store'
import { CategoryService } from 'src/api/category.api'
import { ItemService } from 'src/api/item.api'
import { ItemCatalogsService } from 'src/api/item-catalogs.api'
import { notEmpty, notEmptyNumber } from 'src/utils/formValidations'
import { handleRequest } from 'src/utils/handleRequest'

import SingleItemsList, { SingleItemStatus } from '../components/SingleItemsList.vue'
import { externalApi } from 'src/api'
import { makeAPICall } from 'src/utils/imgBb'

// TODO: add autocomplete for categories

/* ================= SETUP ================= */
const $q = useQuasar()
const router = useRouter()

const categories = ref<Category[]>([])
const singleItemsStatusesCatalog = ref<SingleItemStatus[]>([])

onMounted(async () => {
  const { data: categoriesData } = await handleRequest(CategoryService.findAll)
  categories.value = categoriesData as Category[]

  const { data: singleItemStausesData } = await handleRequest(
    ItemCatalogsService.getSingleItemStatuses,
  )
  singleItemsStatusesCatalog.value = singleItemStausesData as SingleItemStatus[]
})

/* ================= FORM ================= */
interface FormData {
  name: string | null
  description?: string | null
  // imgFiles: []
  categoriesIds: { idCategory: string; name: string }[]
  amount: number
}

const formData = ref<FormData>({
  name: null,
  description: null,
  categoriesIds: [],
  amount: 1,
})

const form1 = ref<QForm>()

async function onClickNext() {
  const validForm = await form1.value?.validate()

  if (validForm) stepper.value?.next()
}

async function onSubmit() {
  Loading.show()

  const imgPayload = SingleItemStore.store
    .filter((i) => i.image)
    .map((i) => ({ image: i.image, name: i.tempId }))

  const promises = imgPayload.map(makeAPICall)
  const responses = await Promise.all(promises)

  SingleItemStore.store.forEach((sItem, i) => {
    if (sItem.image) {
      const imgUrl = responses.find((res) => (res.data.data.title = sItem.tempId))
      console.log(imgUrl)
      SingleItemStore.store[i].imgUrl = imgUrl.data.data.thumb.url
    }
    delete SingleItemStore.store[i].image
  })

  const payload = {
    ...formData.value,
    categoriesIds: formData.value.categoriesIds.map((category) => category.idCategory),
    singleItems: SingleItemStore.store.map((singleItem: SingleItem) => ({
      comments: singleItem.comments,
      idSingleItemStatus: singleItem.singleItemStatus.idSingleItemStatus,
      imgUrl: singleItem.imgUrl,
    })),
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

// TODO: implement handle request fn

/* ================= STEPPER ================= */
const step = ref<number>(1)
const stepper = ref<QStepper>()
</script>

<template>
  <q-page class="q-mx-lg q-py-md">
    <div class="row">
      <div class="col-12 col-sm-8 col-md-6 col-lg-4">
        <q-stepper v-model="step" animated ref="stepper">
          <q-step :name="1" :done="step > 1" title="Registrar Item">
            <q-form ref="form1">
              <div class="row q-gutter-sm">
                <div class="col-12">
                  <q-input
                    v-model="formData.name"
                    type="text"
                    label="Nombre*"
                    @update:model-value="SingleItemStore.setItemName"
                    :rules="[notEmpty]"
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
                    label="Categorías*"
                    multiple
                    use-chips
                    option-value="id"
                    option-label="name"
                    :rules="[notEmpty]"
                  ></q-select>
                </div>
                <div class="col-12">
                  <q-input
                    type="number"
                    v-model.number.lazy="formData.amount"
                    min="1"
                    max="20"
                    label="Cantidad*"
                    @update:model-value="SingleItemStore.updateStore"
                    :rules="[notEmptyNumber]"
                  />
                </div>
              </div>
            </q-form>
          </q-step>
          <q-step :name="2" :done="step > 2" title="Registrar Piezas">
            <single-items-list
              :single-items-amount="formData.amount"
              :single-item-statuses-catalog="singleItemsStatusesCatalog"
            />
          </q-step>
          <template v-slot:navigation>
            <q-stepper-navigation>
              <q-btn v-if="step < 2" color="primary" @click="onClickNext"
                >Siguiente</q-btn
              >
              <q-btn v-if="step > 1" color="primary" @click="stepper?.previous()"
                >Anterior</q-btn
              >
              <q-btn
                v-if="step === 2"
                color="green"
                type="submit"
                class="q-ml-sm"
                @click="onSubmit"
                >Registrar</q-btn
              >
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </div>
    </div>
  </q-page>
</template>

<style>
.q-field__label {
  font-size: 14px !important;
}
</style>
