<script setup lang="ts">
import { QTable, QTableProps } from 'quasar'
import BorrowingHistoryDialog from '../components/BorrowingsHistoryDialog.vue'
import { ref } from 'vue'

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

const isDialogActive = ref<boolean>(false)

const dialog = ref()

function onRowClick(e: Event, item: SingleItemTable) {
  console.log(item.sku)
  isDialogActive.value = true
  dialog.value.getData(item.sku)
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

  <BorrowingHistoryDialog v-model="isDialogActive" ref="dialog" />
</template>
