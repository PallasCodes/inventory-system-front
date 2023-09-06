<script setup lang="ts">
import { QTableProps } from 'quasar'

export interface CategoryTable {
  idCategory: string
  name: string
  numTotalItems: number
  description?: string
  numAvailableItems: number
  numUnavailableItems: number
  numBorrowedItems: number
}

interface Props {
  categories: CategoryTable[]
  isLoading: boolean
}

const props = defineProps<Props>()

const columns: QTableProps['columns'] = [
  {
    name: 'name',
    label: 'Item',
    required: true,
    align: 'left',
    sortable: true,
    field: (row) => row.name,
  },
  {
    name: 'numTotalItems',
    label: 'No. Piezas',
    required: true,
    align: 'left',
    sortable: true,
    field: (row) => row.numTotalItems,
  },
  {
    name: 'description',
    label: 'Descripción',
    required: false,
    align: 'left',
    sortable: false,
    field: (row) => row.description,
  },
  {
    name: 'numAvailableItems',
    label: 'Disponibles',
    required: true,
    align: 'left',
    sortable: true,
    field: (row) => row.numAvailableItems,
  },
  {
    name: 'numBorrowedItems',
    label: 'Prestadas',
    required: true,
    align: 'left',
    sortable: true,
    field: (row) => row.numBorrowedItems,
  },
  {
    name: 'numUnavailableItems',
    label: 'No disponibles',
    required: true,
    align: 'left',
    sortable: true,
    field: (row) => row.numTotalItems - row.numAvailableItems,
  },
]

const emit = defineEmits<{ (e: 'onRowClick', idItem: string): void }>()

const onClickRow = (evt: Event, row: CategoryTable) => {
  emit('onRowClick', row.idCategory)
}
</script>

<template>
  <q-table
    title="Items de la categoría"
    :rows="props.categories || []"
    :columns="columns"
    row-key="idCategory"
    :loading="props.isLoading"
    :pagination="{ rowsPerPage: 20 }"
    @row-click="onClickRow"
  />
</template>
