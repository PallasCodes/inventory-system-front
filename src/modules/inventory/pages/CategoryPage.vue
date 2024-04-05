<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { CategoryService } from 'src/api/category.api'
import { ItemService } from 'src/api/item.api'
import { handleRequest } from 'src/utils/handleRequest'

import CategoryDetailTable from '../components/CategoryDetailTable.vue'
import { Loading } from 'quasar'

const route = useRoute()
const router = useRouter()
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

const categories = ref()

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
    tableIsLoading.value = false
    categories.value = data
  }
}

onMounted(async () => {
  if (!route.params.id) return

  Loading.show()

  const idCategory = route.params.id as string

  await Promise.all([getCategory(idCategory), getItems(idCategory)])

  Loading.hide()
})

const tableIsLoading = ref<boolean>(true)
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
    <div class="col-auto q-mt-sm">
      <img
        style="width: 100%; height: auto"
        :src="categoryData?.imgUrl ? categoryData.imgUrl : ''"
      />
    </div>
  </div>

  <div class="row q-mt-xl">
    <div class="col-auto">
      <category-detail-table
        :categories="categories || []"
        :is-loading="tableIsLoading"
        @on-row-click="router.replace('/')"
      />
    </div>
  </div>
</template>
