<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { CategoryService } from 'src/api/category.api'
import { ItemService } from 'src/api/item.api'
import { handleRequest } from 'src/utils/handleRequest'

import ItemsTable, { ItemTable } from '../components/ItemsTable.vue'
import SingleItemsTable, { SingleItemTable } from '../components/SingleItemsTable.vue'
import { Loading } from 'quasar'

const route = useRoute()
const categoryData = ref<CategoryData>()

interface CategoryData {
  idCategory: string
  name: string
  imgUrl?: string
  description?: string
  createdAt: string | Date
  numItems: number
  numSingleItems: number
}

async function getCategory(idCategory: string) {
  const { data, message, error } = await handleRequest(
    CategoryService.findOneById,
    idCategory,
  )

  if (error) {
    message?.display()
  } else {
    categoryData.value = data.category as CategoryData
    categoryData.value.createdAt = new Date(
      categoryData.value.createdAt,
    ).toLocaleDateString()
    categoryData.value.numItems = data.itemsCount
    categoryData.value.numSingleItems = data.singleItemsCount
  }
}

async function getItems(idCategory: string) {
  const { data, error, message } = await handleRequest(
    ItemService.findByCategory,
    idCategory,
  )

  if (error) {
    message?.display()
  } else {
    isTableDataLoading.value = false
    items.value = data
    setTimeout(selectFirstRow, 500)
  }
}

onMounted(async () => {
  if (!route.params.id) return

  Loading.show()

  const idCategory = route.params.id as string

  await Promise.all([getCategory(idCategory), getItems(idCategory)])

  Loading.hide()
})

const items = ref<ItemTable[]>([])
const singleItems = ref<SingleItemTable[]>([])

const isTableDataLoading = ref<boolean>(true)
const selectedItemName = ref<string>('')

function selectFirstRow() {
  const rows = document.querySelectorAll('.q-table .cursor-pointer')
  if (rows.length >= 1) (rows[0] as HTMLTableRowElement).click()
}

async function onClickRow(idItem: string) {
  selectedItemName.value = items.value.find((item) => item.idItem === idItem)
    ?.name as string
  const { data } = await handleRequest(ItemService.findOneById, idItem)
  singleItems.value = data.singleItems as SingleItemTable[]
}

function onDeleteItem(idItem: string) {
  items.value = items.value.filter((item: ItemTable) => item.idItem !== idItem)
  selectFirstRow()
}

function onDeleteSI(sku: string) {
  singleItems.value = singleItems.value.filter(
    (singleItem: SingleItemTable) => singleItem.sku !== sku,
  )
}
</script>

<template>
  <div class="row">
    <div class="col-12">
      <span class="text-h5">{{ categoryData?.name }}</span>
    </div>
    <div class="col-12 q-pt-sm">
      <p>
        <span class="block q-mb-xs"
          ><b>Registrado el:</b> {{ categoryData?.createdAt }}</span
        >
        <span class="q-mr-lg"> <b>Modelos:</b> {{ categoryData?.numItems }} </span>
        <span> <b>Items:</b> {{ categoryData?.numSingleItems }} </span>
      </p>
      <p>{{ categoryData?.description }}</p>
    </div>
    <div class="col-auto q-mt-sm q-mb-xl">
      <img
        style="width: 100%; height: auto; max-width: 300px"
        :src="categoryData?.imgUrl ? categoryData.imgUrl : ''"
      />
    </div>
  </div>

  <ItemsTable
    :items="items"
    :is-loading="isTableDataLoading"
    @on-row-click="onClickRow"
    @delete="onDeleteItem"
    :show-filters="false"
  />

  <SingleItemsTable
    :single-items="singleItems"
    :is-loading="isTableDataLoading"
    :item-name="selectedItemName"
    @delete="onDeleteSI"
  />
</template>
