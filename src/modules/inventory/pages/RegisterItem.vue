<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Loading, QForm, QStepper, useQuasar } from 'quasar'

import { Category } from '../interfaces/Category'
import SingleItemStore, { SingleItem } from '../stores/single-item-store'
import { CategoryService } from 'src/api/category.api'
import { ItemService } from 'src/api/item.api'
import { SingleItemStatusCatalog } from '../interfaces/SingleItemStatus.catalog'
import { notEmpty, notEmptyNumber } from 'src/utils/formValidations'
import { handleRequest } from 'src/utils/handleRequest'

import SingleItemsList from '../components/SingleItemsList.vue'
import { makeAPICall } from 'src/utils/imgBb'
import { formatters } from 'src/utils/formatters'

// TODO: add autocomplete for categories

/* ================= SETUP ================= */
const $q = useQuasar()
const router = useRouter()

const categories = ref<Category[]>([])

onMounted(async () => {
  const { data: categoriesData } = await handleRequest(CategoryService.findAll)
  categories.value = categoriesData as Category[]
})

/* ================= FORM ================= */
interface FormData {
  name: string | null
  description?: string | null
  categoriesIds: { idCategory: string; name: string }[]
  amount: number
  registerSIDetails: boolean
}

const formData = ref<FormData>({
  name: null,
  description: null,
  categoriesIds: [],
  amount: 1,
  registerSIDetails: true,
})

const form1 = ref<QForm>()

async function onClickNext() {
  Loading.show()

  const validForm = await form1.value?.validate()
  if (!validForm) return

  let auxSkuPrefix = formData.value.name
    ?.replace(/\s+/g, '')
    .substring(0, 3)
    .toUpperCase()

  const { data, message, error } = await handleRequest(
    ItemService.generateSkuPrefix,
    auxSkuPrefix,
  )

  Loading.hide()

  if (error) {
    message?.display()
  } else {
    skuPrefix.value = data.skuPrefix
    stepper.value?.next()
  }
}

const skuPrefix = ref<string>('')

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
      SingleItemStore.store[i].imgUrl = imgUrl.data.data.thumb.url
    }
    delete SingleItemStore.store[i].image
  })

  const payload = {
    ...formData.value,
    skuPrefix: skuPrefix.value,
    categoriesIds: formData.value.categoriesIds.map((category) => category.idCategory),
    singleItems: SingleItemStore.store.map((singleItem: SingleItem, i: number) => ({
      comments: singleItem.comments,
      idSingleItemStatus: singleItem.singleItemStatus.idSingleItemStatus,
      imgUrl: singleItem.imgUrl,
      sku: skuPrefix.value + formatters.pad(i, 3),
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
  <div style="max-width: 800px">
    <q-stepper v-model="step" animated ref="stepper">
      <q-step :name="1" :done="step > 1" title="Registrar Modelo">
        <q-form ref="form1">
          <div class="row q-gutter-sm">
            <div class="col-12">
              <q-input
                v-model="formData.name"
                type="text"
                label="Nombre*"
                @update:model-value="SingleItemStore.setItemName"
                :rules="[notEmpty]"
                style="max-width: 300px"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="formData.description"
                type="textarea"
                label="Descripción"
                autogrow
                :rows="3"
                style="max-width: 300px"
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
                style="max-width: 300px"
              ></q-select>
            </div>
            <div class="col-12">
              <q-input
                type="number"
                v-model.number.lazy="formData.amount"
                min="1"
                max="20"
                label="Num. de items*"
                @update:model-value="SingleItemStore.updateStore"
                :rules="[notEmptyNumber]"
                style="max-width: 300px"
              />
            </div>
            <div class="col-12">
              <q-checkbox
                v-model="formData.registerSIDetails"
                label="Registrar detalles de cada item"
                style="max-width: 300px; color: #00000099"
              />
            </div>
          </div>
        </q-form>
      </q-step>
      <q-step :name="2" :done="step > 2" title="Registrar Items">
        <single-items-list
          :single-items-amount="formData.amount"
          :single-item-status-catalog="SingleItemStatusCatalog"
          :sku-prefix="skuPrefix"
        />
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn v-if="step < 2" color="primary" @click="onClickNext">Siguiente</q-btn>
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
</template>

<style>
.q-field__label {
  font-size: 14px !important;
}
</style>
