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
const showGrid = ref<boolean>(true)

function onRowClick(e: any, row: SingleItemTable) {
  sku.value = row.sku
  isDialogActive.value = true
  dialog.value.getData(row.sku)
}

const colors: string[] = ['positive', 'negative', 'secondary', 'orange']
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
    :grid="showGrid"
    @row-click="onRowClick"
  >
    <template #top-right>
      <span class="q-mr-sm">Mostrar Items en:</span>
      <q-btn-group flat push>
        <q-btn
          size="xs"
          :color="showGrid ? 'primary' : 'white'"
          :text-color="showGrid ? 'white' : 'black'"
          @click="showGrid = true"
        >
          <q-icon name="grid_view" />
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
            top
            style="font-size: 12px"
          >
            Cuadrícula
          </q-tooltip>
        </q-btn>
        <q-btn
          size="xs"
          :color="showGrid ? 'white' : 'primary'"
          :text-color="showGrid ? 'black' : 'white'"
          @click="showGrid = false"
        >
          <q-icon name="table_rows" />
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
            top
            style="font-size: 12px"
          >
            Tabla
          </q-tooltip>
        </q-btn>
      </q-btn-group>
    </template>

    <template #item="props">
      <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-2 grid-style-transition">
        <q-card
          bordered
          flat
          style="cursor: pointer"
          @click="onRowClick(null, props.row)"
          class="card"
        >
          <q-card-section>
            <span class="block text-subtitle2">{{ props.row.sku }}</span>
            <q-chip
              size="12px"
              outline
              style="font-weight: 500"
              :color="colors[props.row.singleItemStatus.idSingleItemStatus - 1]"
              class="q-mt-sm"
              >{{ props.row.singleItemStatus?.name }}</q-chip
            >
            <q-img :src="props.row.imgUrl ? props.row.imgUrl : 'noImg.png'" />
          </q-card-section>

          <q-card-section class="q-pt-none q-mt-none" v-if="props.row.comments">
            <span class="block" style="font-weight: 500">Comentarios</span>
            <span class="block text-body2">{{ props.row.comments }}</span>
          </q-card-section>
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

<style>
.card:hover {
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
</style>
