<script setup lang="ts">
import { QTable, QTableProps } from 'quasar'

export interface SingleItemTable {
  sku: string
  comments?: string
  status: string
}

interface Props {
  singleItems: SingleItemTable[]
  isLoading: boolean
}

const props = defineProps<Props>()

const columns: QTableProps['columns'] = [
  {
    name: 'sku',
    label: 'SKU',
    required: true,
    align: 'left',
    sortable: true,
    field: (row) => row.sku,
    style: 'min-width: 200px',
  },
  {
    name: 'comments',
    label: 'Comentarios',
    required: false,
    align: 'left',
    sortable: false,
    field: (row) => row.comments,
  },
  {
    name: 'status',
    label: 'Estatus',
    required: true,
    align: 'left',
    sortable: true,
    field: (row) => row.singleItemStatus?.name,
  },
]
</script>

<template>
  <q-table
    title="Items del modelo:"
    :rows="props.singleItems || []"
    :columns="columns"
    row-key="idSingleItem"
    :loading="props.isLoading"
    :pagination="{ rowsPerPage: 20 }"
  />
</template>
