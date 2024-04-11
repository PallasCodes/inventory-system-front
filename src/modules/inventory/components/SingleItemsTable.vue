<script setup lang="ts">
import { Loading, QTable, QTableProps } from 'quasar'
import BorrowingHistoryDialog from '../components/BorrowingsHistoryDialog.vue'
import { ref } from 'vue'

import TableAction from 'src/components/TableAction.vue'
import DeleteDialog from 'src/components/DeleteDialog.vue'
import { handleRequest } from 'src/utils/handleRequest'
import { SingleItemService } from 'src/api/single-item.api'

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

const emit = defineEmits(['delete'])

const columns: QTableProps['columns'] = [
  {
    name: 'actions',
    label: 'Acciones',
    required: true,
    align: 'left',
    sortable: false,
    field: 'actions',
  },
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
    style: 'min-width: 250px',
  },
]

const isDialogActive = ref<boolean>(false)

const dialog = ref()
const dialogDeleteSI = ref<boolean>()

const sku = ref<string>('')
const showGrid = ref<boolean>(true)

const selectedSI = ref<SingleItemTable>()

function onRowClick(e: any, row: SingleItemTable) {
  sku.value = row.sku
  isDialogActive.value = true
  dialog.value.getData(row.sku)
}

function onClickDeleteSI(row: SingleItemTable) {
  selectedSI.value = row
  dialogDeleteSI.value = true
}

async function onDeleteSI() {
  Loading.show()

  const { message, error } = await handleRequest(
    SingleItemService.delete,
    selectedSI.value?.sku,
  )

  if (!error) emit('delete', selectedSI.value?.sku)

  Loading.hide()
  message?.display()
}

const colors: string[] = ['positive', 'negative', 'secondary', 'orange']
</script>

<template>
  <div class="row q-mt-lg">
    <div :class="showGrid ? 'col-12' : 'col-auto'">
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

        <!-- SINGLE ITEM CARD -->

        <template #item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-2 grid-style-transition">
            <q-card
              bordered
              flat
              style="cursor: pointer"
              @click="onRowClick(null, props.row)"
              class="card"
            >
              <div class="flex items-center justify-between q-pl-md q-pt-sm">
                <div>
                  <span class="block text-subtitle2">{{ props.row.sku }}</span>
                </div>
                <div>
                  <q-btn color="grey-7" round flat icon="more_vert" @click.stop>
                    <q-menu cover auto-close>
                      <q-list>
                        <q-item clickable>
                          <q-item-section @click.stop="onClickDeleteSI(props.row)"
                            >Eliminar</q-item-section
                          >
                        </q-item>
                        <q-item clickable>
                          <q-item-section>Editar</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </div>
              <q-card-section class="q-mt-none q-pt-none">
                <q-chip
                  size="12px"
                  outline
                  style="font-weight: 500"
                  :color="colors[props.row.singleItemStatus.idSingleItemStatus - 1]"
                  class="q-mt-sm"
                  >{{ props.row.singleItemStatus?.name }}</q-chip
                >
                <q-img :src="props.row.imgUrl ? props.row.imgUrl : '/noImg.png'" />
              </q-card-section>

              <q-card-section class="q-pt-none q-mt-none" v-if="props.row.comments">
                <span class="block" style="font-weight: 500">Comentarios</span>
                <span class="block text-body2">{{ props.row.comments }}</span>
              </q-card-section>
            </q-card>
          </div>
        </template>

        <!-- CUSTOM TABLE CELLS -->

        <template #body-cell-actions="{ row }">
          <q-td>
            <TableAction
              icon="delete"
              icon-color="negative"
              label="Eliminar item"
              @click.stop="onClickDeleteSI(row)"
            />
            <TableAction
              icon="edit"
              icon-color="primary"
              label="Editar item"
              @click.stop="onClickDeleteSI(row)"
            />
          </q-td>
        </template>

        <template #body-cell-status="{ row }">
          <q-td>
            <q-chip
              size="12px"
              outline
              style="font-weight: 500"
              :color="colors[row.singleItemStatus.idSingleItemStatus - 1]"
              class="q-mt-sm"
              >{{ row.singleItemStatus?.name }}</q-chip
            >
          </q-td>
        </template>
      </q-table>
    </div>

    <BorrowingHistoryDialog
      v-model="isDialogActive"
      ref="dialog"
      :item-model="props.itemName"
      :sku="sku"
    />
  </div>

  <DeleteDialog
    v-model="dialogDeleteSI"
    :title="`¿Desea eliminar el item: ${selectedSI?.sku}?`"
    @delete="onDeleteSI"
  />
</template>

<style>
.card:hover {
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
</style>
