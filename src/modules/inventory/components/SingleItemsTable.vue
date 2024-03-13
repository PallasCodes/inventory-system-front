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
  itemName: string
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

function onRowClick(...args: any) {
  console.log(args)
}
</script>

<template>
  <q-table
    :title="`Items del modelo: ${itemName}`"
    row-key="idSingleItem"
    :rows="props.singleItems || []"
    :columns="columns"
    :loading="props.isLoading"
    :pagination="{ rowsPerPage: 20 }"
    flat
    bordered
    grid
    @row-click="onRowClick"
  />
</template>
