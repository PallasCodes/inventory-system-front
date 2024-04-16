<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Loading } from 'quasar'

import { CategoryService } from 'src/api/category.api'
import { ItemService } from 'src/api/item.api'
import { handleRequest } from 'src/utils/handleRequest'

import { ItemTable } from '../components/ItemsTable.vue'
import ItemsTableWithDetails from '../components/ItemsTableWithDetails.vue'

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
const isTableDataLoading = ref<boolean>(true)
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

  <ItemsTableWithDetails :items="items" :is-table-data-loading="isTableDataLoading" />
</template>
