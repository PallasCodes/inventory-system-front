<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Loading, QTable, QTableProps } from 'quasar'

import { handleRequest } from 'src/utils/handleRequest'
import { CategoryService } from 'src/api/category.api'
import { Category } from '../interfaces/Category'
import { ItemService } from 'src/api/item.api'

import { CategoryTable } from './CategoryDetailTable.vue'
import TableAction from 'src/components/TableAction.vue'
import DeleteDialog from 'src/components/DeleteDialog.vue'

export interface ItemTable {
  idItem: string
  name: string
  numTotalItems: number
  numAvailableItems: number
  numUnavailableItems: number
  numBorrowedItems: number
  numFixingItems: number
  idCategory: string
  categoryName: string
  categories: any[]
}

interface Props {
  items: ItemTable[]
  isLoading: boolean
  showFilters?: boolean
}

const search = ref<string>('')
const filteredCategories = ref<string[]>([])

const props = withDefaults(defineProps<Props>(), { showFilters: true })

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
    name: 'name',
    label: 'Modelo',
    required: true,
    align: 'left',
    sortable: true,
    field: (row) => row.name,
    style: 'min-width: 200px',
  },
  {
    name: 'categories',
    label: 'Categorías',
    required: false,
    align: 'left',
    sortable: true,
    field: (row) => row.categories.map((c: CategoryTable) => c.name).join(', '),
  },
  {
    name: 'numTotalItems',
    label: 'Items totales',
    required: false,
    align: 'left',
    sortable: true,
    field: 'numTotalItems',
  },
  {
    name: 'numAvailableItems',
    label: 'Disponibles',
    required: false,
    align: 'left',
    sortable: true,
    field: 'numAvailableItems',
  },
  {
    name: 'numBorrowedItems',
    label: 'Prestados',
    required: false,
    align: 'left',
    sortable: true,
    field: 'numBorrowedItems',
  },
  {
    name: 'numUnavailableItems',
    label: 'No disponibles',
    required: false,
    align: 'left',
    sortable: true,
    field: 'numUnavailableItems',
  },
  {
    name: 'numFixingItems',
    label: 'En reparación',
    required: false,
    align: 'left',
    sortable: true,
    field: 'numFixingItems',
  },
]

const emit = defineEmits(['onRowClick', 'delete'])

const onRowClick = (evt: Event, row: ItemTable) => {
  emit('onRowClick', row.idItem)
}

const categoriesCatalog = ref<Category[]>([])

const selectedItem = ref<ItemTable>()
const dialogDeleteItem = ref<boolean>(false)

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

function onClickDeleteItem(row: ItemTable) {
  selectedItem.value = row
  dialogDeleteItem.value = true
}

async function onDeleteItem() {
  Loading.show()

  const { message, error } = await handleRequest(
    ItemService.delete,
    selectedItem.value?.idItem,
  )
  if (!error) emit('delete', selectedItem.value?.idItem)

  Loading.hide()
  message?.display()
}

function onclickUpdateItem(row: ItemTable) {
  console.log(row)
}
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
    <div class="col-auto" v-if="showFilters">
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
      >
        <template #body-cell-actions="{ row }">
          <q-td>
            <TableAction
              icon="delete"
              icon-color="negative"
              label="Eliminar item"
              @click.stop="onClickDeleteItem(row)"
            />
            <TableAction
              icon="edit"
              icon-color="primary"
              label="Editar item"
              @click.stop="onclickUpdateItem(row)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>

  <DeleteDialog
    v-model="dialogDeleteItem"
    :title="`¿Desea eliminar el modelo: ${selectedItem?.name}?`"
    @delete="onDeleteItem"
  />
</template>
