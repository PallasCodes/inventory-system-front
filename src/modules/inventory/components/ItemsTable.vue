<script setup lang="ts">
import { Loading, QTable, QTableProps } from 'quasar'
import { CategoryService } from 'src/api/category.api'
import { handleRequest } from 'src/utils/handleRequest'
import { computed, onMounted, ref } from 'vue'
import { Category } from '../interfaces/Category'
import { CategoryTable } from './CategoryDetailTable.vue'

export interface ItemTable {
  idItem: string
  name: string
  numTotalItems: number
  numAvailableItems: number
  numUnavailableItems: number
  numBorrowedItems: number
  idCategory: string
  categoryName: string
  categories: any[]
}

interface Props {
  items: ItemTable[]
  isLoading: boolean
}

const search = ref<string>('')
const filteredCategories = ref<string[]>([])

const props = defineProps<Props>()

const columns: QTableProps['columns'] = [
  {
    name: 'name',
    label: 'Modelo',
    required: true,
    align: 'left',
    sortable: true,
    field: (row) => row.name,
    style: 'min-width: 200px',
  },
  {
    name: 'numTotalItems',
    label: 'Items',
    required: false,
    align: 'left',
    sortable: true,
    field: (row) => row.numTotalItems,
  },
  {
    name: 'numAvailableItems',
    label: 'Disponibles',
    required: false,
    align: 'left',
    sortable: true,
    field: (row) => row.numAvailableItems,
  },
  {
    name: 'numBorrowedItems',
    label: 'Prestadas',
    required: false,
    align: 'left',
    sortable: true,
    field: (row) => row.numBorrowedItems,
  },
  {
    name: 'numUnavailableItems',
    label: 'No disponibles',
    required: false,
    align: 'left',
    sortable: true,
    field: (row) => row.numTotalItems - row.numAvailableItems,
  },
  {
    name: 'numUnavailableItems',
    label: 'En reparación',
    required: false,
    align: 'left',
    sortable: true,
    field: (row) => row.numTotalItems - row.numAvailableItems,
  },
]

const emit = defineEmits<{ (e: 'onRowClick', idItem: string): void }>()

const onRowClick = (evt: Event, row: ItemTable) => {
  emit('onRowClick', row.idItem)
}

const categoriesCatalog = ref<Category[]>([])

const getItems = computed(() => {
  let items = props.items

  if (filteredCategories.value?.length > 0) {
    items = items.filter((item: ItemTable) =>
      item.categories.some((category: CategoryTable) =>
        filteredCategories.value.includes(category.idCategory),
      ),
    )
  }

  if (search.value !== '') {
    items = items.filter((item: ItemTable) =>
      item.name.toLowerCase().includes(search.value.toLocaleLowerCase()),
    )
  }

  return items
})

onMounted(async () => {
  Loading.show()

  const { data, message, error } = await handleRequest(CategoryService.findAll)

  if (error) {
    message?.display()
  } else {
    categoriesCatalog.value = data
  }

  Loading.hide()
})
</script>

<template>
  <div class="row">
    <div class="col-auto">
      <q-input
        v-model="search"
        type="search"
        placeholder="Buscar item"
        dense
        standout
        filled
        style="font-size: 12px !important; width: 280px"
        class="q-mr-xl"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div class="col-auto">
      <q-select
        v-model="filteredCategories"
        :options="categoriesCatalog"
        label="Filtrar por categoría"
        option-value="idCategory"
        option-label="name"
        style="width: 200px"
        borderless
        dense
        emit-value
        map-options
        clearable
        multiple
      />
    </div>
  </div>

  <div class="row q-mt-lg">
    <div class="col-auto">
      <q-table
        title="Modelos en inventario"
        :rows="getItems || []"
        :columns="columns"
        :loading="props.isLoading"
        :pagination="{ rowsPerPage: 20 }"
        row-key="idItem"
        @row-click="onRowClick"
      />
    </div>
  </div>
</template>
