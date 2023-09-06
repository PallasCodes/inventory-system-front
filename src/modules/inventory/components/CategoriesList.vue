<script setup lang="ts">
import { Category } from '../interfaces/Category'

import CategoryCard from './CategoryCard.vue'

interface Props {
  categories: Category[]
}

const props = defineProps<Props>()
</script>

<template>
  <div class="row q-gutter-md">
    <div
      class="col-12 col-sm-4 col-md-3 col-lg-2"
      v-for="category in props.categories"
      :key="category.id"
    >
      <category-card :category="category" />
    </div>
    <div class="col-12">
      <span v-if="categories.length === 0" class="font-weight-medium"
        >No se encontró ninguna categoría</span
      >
    </div>
  </div>
</template>
