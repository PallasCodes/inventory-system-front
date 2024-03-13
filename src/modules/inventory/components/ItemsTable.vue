<script setup lang="ts">
import { QTable, QTableProps } from 'quasar'

export interface ItemTable {
  idItem: string
  name: string
  numTotalItems: number
  numAvailableItems: number
  numUnavailableItems: number
  numBorrowedItems: number
}

interface Props {
  items: ItemTable[]
  isLoading: boolean
}

const props = defineProps<Props>()

const columns: QTableProps['columns'] = [
  {
    name: 'name',
    label: 'Nombre',
    required: true,
    align: 'left',
    sortable: true,
    field: (row) => row.name,
    style: 'min-width: 200px',
  },
  {
    name: 'numTotalItems',
    label: 'Piezas',
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
]

const emit = defineEmits<{ (e: 'onRowClick', idItem: string): void }>()

const onRowClick = (evt: Event, row: ItemTable) => {
  emit('onRowClick', row.idItem)
}
</script>

<template>
  <q-table
    title="Modelos en inventario"
    :rows="props.items || []"
    :columns="columns"
    :loading="props.isLoading"
    :pagination="{ rowsPerPage: 20 }"
    row-key="idItem"
    @row-click="onRowClick"
  />
</template>
