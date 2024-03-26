<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import { CategoryService } from 'src/api/category.api'

import CategoriesList from '../components/CategoriesList.vue'
import { Category } from '../interfaces/Category'
import { handleRequest } from 'src/utils/handleRequest'

const orderBy = ref<string>('Descendente')
const orderOptions = ref<string[]>(['Ascendente', 'Descendente'])

const search = ref<string>('')

const categories = ref<Category[]>()
const allCategories = ref<Category[]>()

onMounted(async () => {
  const { data, error, message } = await handleRequest(CategoryService.findAll)

  if (error) {
    message?.display()
  } else {
    allCategories.value = data as Category[]
    categories.value = data as Category[]
  }
})

watch(
  () => search.value,
  () => {
    if (!search.value) categories.value = allCategories.value
    categories.value = allCategories.value?.filter((category) =>
      category.name.toLowerCase().includes(search.value.toLowerCase()),
    )
  },
)

const changeCategoriesSort = () => {
  if (orderBy.value === 'Descendente') {
    categories.value?.sort((a: Category, b: Category) => {
      let fa = a.name.toLowerCase()
      let fb = b.name.toLowerCase()

      if (fa < fb) return -1
      if (fa > fb) return 1
      return 0
    })
  } else {
    categories.value?.sort((a: Category, b: Category) => {
      let fa = a.name.toLowerCase()
      let fb = b.name.toLowerCase()

      if (fa < fb) return 1
      if (fa > fb) return -1
      return 0
    })
  }
}

function onCategoryDelete(id: string) {
  categories.value = categories.value?.filter(
    (category: Category) => category.idCategory !== id,
  )
}
</script>

<template>
  <q-page class="q-py-md q-px-lg">
    <span class="text-subtitle1 q-mb-lg block">Categorías registradas</span>
    <div class="row items-center justify-between">
      <div class="col-12 col-md-3">
        <q-input
          v-model="search"
          type="search"
          placeholder="Buscar categoría"
          dense
          standout
          filled
          style="font-size: 12px !important"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-2">
        <q-select
          borderless
          v-model="orderBy"
          :options="orderOptions"
          label="Ordenar por"
          dense
          @update:model-value="changeCategoriesSort"
        />
      </div>
    </div>

    <categories-list
      :categories="categories || []"
      class="q-mt-sm"
      @on-delete="onCategoryDelete"
    />
  </q-page>
</template>
