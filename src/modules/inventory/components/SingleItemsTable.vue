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
    name: 'status',
    label: 'Estatus',
    required: true,
    align: 'left',
    sortable: true,
    field: (row) => row.singleItemStatus?.name,
  },
  {
    name: 'imgUrl',
    label: 'Imagen',
    required: false,
    align: 'left',
    sortable: false,
    field: 'imgUrl',
  },
  {
    name: 'comments',
    label: 'Comentarios',
    required: false,
    align: 'left',
    sortable: false,
    field: (row) => row.comments,
  },
]

const isDialogActive = ref<boolean>(false)

const dialog = ref()

const sku = ref<string>('')

function onRowClick(row: SingleItemTable) {
  sku.value = row.sku
  console.log(row)
  isDialogActive.value = true
  dialog.value.getData(row.sku)
}
</script>

<template>
  <q-table
    :title="`Items del modelo: ${itemName}`"
    row-key="idSingleItem"
    :rows="props.singleItems || []"
    :columns="columns"
    :loading="props.isLoading"
    :pagination="{ rowsPerPage: 18 }"
    flat
    bordered
    grid
  >
    <template #item="props">
      <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-2 grid-style-transition">
        <q-card bordered flat style="cursor: pointer" @click="onRowClick(props.row)">
          <q-card-section>
            <q-img
              :src="
                props.imgUrl
                  ? props.imgUrl
                  : 'https://static.thenounproject.com/png/4693713-200.png'
              "
            />
          </q-card-section>

          <q-list dense>
            <q-item
              v-for="col in props.cols.filter((col: any) => col.name !== 'imgUrl')"
              :key="col.name"
            >
              <q-item-section>
                <q-item-label>{{ col.label }}</q-item-label>
                <q-item-label caption lines="2">{{ col.value }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </template>
  </q-table>

  <BorrowingHistoryDialog
    v-model="isDialogActive"
    ref="dialog"
    :item-model="props.itemName"
    :sku="sku"
  />
</template>
