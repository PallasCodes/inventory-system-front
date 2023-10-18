<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { CategoryService } from 'src/api/category.api'
import { ItemService } from 'src/api/item.api'
import { handleRequest } from 'src/utils/handleRequest'

import CategoryDetailTable from '../components/CategoryDetailTable.vue'

const route = useRoute()
const router = useRouter()
const categoryData = ref<CategoryData>()

interface CategoryData {
  idCategory: string
  name: string
  imgUrl?: string
  description?: string
  createdAt: string | Date
}

const categories = ref()

onMounted(async () => {
  if (!route.params.id) return

  const idCategory = route.params.id as string

  const { data } = await handleRequest(CategoryService.findOneById, idCategory)
  categoryData.value = data as CategoryData
  categoryData.value.createdAt = new Date(
    categoryData.value.createdAt,
  ).toLocaleDateString()

  const { data: tableData } = await handleRequest(ItemService.findByCategory, idCategory)
  tableIsLoading.value = false
  categories.value = tableData
})

const tableIsLoading = ref<boolean>(true)
</script>

<template>
  <q-page class="q-mx-lg q-py-md">
    <div class="row">
      <div class="col-12">
        <span class="text-h5">{{ categoryData?.name }}</span>
      </div>
      <div class="col-12 q-pt-sm">
        <span class="q-mr-lg"><b>Items:</b> 20</span> <span><b>Piezas:</b> 52</span>
      </div>
      <div class="col-12 q-pt-sm">
        <p>{{ categoryData?.description }}</p>
      </div>
      <div class="col-12">
        <span><b>Registrado el:</b> {{ categoryData?.createdAt }}</span>
      </div>
      <div class="col-auto q-mt-lg">
        <img
          style="width: 100%; height: auto"
          src="https://picsum.photos/id/237/300/300"
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
  </q-page>
</template>
