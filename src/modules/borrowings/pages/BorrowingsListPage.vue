<script setup lang="ts">
import { Loading, QTableProps } from 'quasar'
import { computed, onMounted, ref } from 'vue'

import { handleRequest } from 'src/utils/handleRequest'
import { BorrowingsService } from 'src/api/borrowings.api'
import { formatters } from 'src/utils/formatters'
import { CategoryService } from 'src/api/category.api'

interface Employee {
  fullName: string
  idEmployee: string
}

export interface SingleItem {
  sku: string
  comments: string
  imgUrl?: string
  createdAt: string
  updatedAt: string
  item: Item
}

export interface Category {
  idCategory: string
  name: string
  description?: string | null
  imgUrl?: string | null
  createdAt: string
  updatedAt: string
}

export interface Item {
  idItem: string
  name: string
  description?: string
  numTotalItems: number
  numAvailableItems: number
  numBorrowedItems: number
  createdAt: string
  updatedAt: string
  categories: Category[]
}

interface ItemTable {
  borrowingDate: string
  borrowingDeadline?: string | null
  comments?: string | null
  employee: Employee
  idBorrowing: string
  returnDate?: string | null
  returned: boolean
  singleItem: SingleItem
}

const borrowings = ref<ItemTable[]>([])
const tableData = ref<ItemTable[]>([])

const columns: QTableProps['columns'] = [
  {
    name: 'singleItem',
    label: 'Modelo',
    required: false,
    align: 'left',
    sortable: true,
    field: (row) => row.singleItem?.item?.name,
  },
  {
    name: 'categories',
    label: 'Modelo',
    required: false,
    align: 'left',
    sortable: true,
    field: (row) =>
      row.singleItem?.item?.categories
        .map((category: Category) => category.name)
        .join(', '),
    style: 'max-width: 300px',
  },
  {
    name: 'employee',
    label: 'Empleado',
    required: false,
    align: 'left',
    sortable: true,
    field: (row) => row.employee.fullName,
  },
  {
    name: 'borrowingDate',
    label: 'Fecha de préstamo',
    required: false,
    align: 'left',
    sortable: true,
    field: (row) => formatters.isoToRegularDate(row.borrowingDate),
  },
  {
    name: 'borrowingDeadline',
    label: 'Fecha acordada de devolución',
    align: 'left',
    field: (row) => formatters.isoToRegularDate(row.borrowingDeadline),
    required: false,
    sortable: true,
  },
  {
    name: 'returnDate',
    label: 'Fecha de devolución',
    align: 'left',
    field: (row) => formatters.isoToRegularDate(row.returnDate),
    required: false,
    sortable: true,
  },
  {
    name: 'returned',
    label: 'Devuelto',
    align: 'left',
    field: 'returned',
    required: true,
    sortable: true,
  },
  {
    name: 'comments',
    label: 'Comentarios',
    align: 'left',
    field: 'comments',
    required: false,
    sortable: true,
  },
]

onMounted(async () => {
  Loading.show()

  await Promise.all([getBorrowings(), getCategories()])

  Loading.hide()
})

async function getBorrowings() {
  const { data, message, error } = await handleRequest(BorrowingsService.findAll)

  if (!error) {
    tableData.value = data
    borrowings.value = data
  } else {
    message?.display()
  }
}

async function getCategories() {
  const { data, message, error } = await handleRequest(CategoryService.findAll)

  if (error) {
    message?.display()
  } else {
    categoriesCatalog.value = data
  }
}

const search = ref<string>('')
const typeOfSearch = ref<string>('item')
const typeOfSearchCatalog = [
  { id: 'item', name: 'Modelo' },
  { id: 'employee', name: 'Empleado' },
]

const returnedStatusCatalog = [
  { id: true, name: 'Retornado' },
  { id: false, name: 'Sin retornar' },
  { id: null, name: 'Ambos' },
]
const filteredReturnedStatus = ref<boolean>()

const filteredCategories = ref<string[]>([])
const categoriesCatalog = ref<Category[]>([])

const getItems = computed(() => {
  let items = tableData.value

  if (filteredCategories.value?.length > 0) {
    items = items.filter((item: ItemTable) =>
      item.singleItem.item.categories.some((category: Category) =>
        filteredCategories.value.includes(category.idCategory),
      ),
    )
  }

  if (filteredReturnedStatus.value === true) {
    items = items.filter((item: ItemTable) => item.returned)
  }

  if (filteredReturnedStatus.value === false) {
    items = items.filter((item: ItemTable) => !item.returned)
  }

  if (search.value !== '') {
    if (typeOfSearch.value === 'employee') {
      items = items.filter((item: ItemTable) =>
        item.employee.fullName
          .toLocaleLowerCase()
          .includes(search.value.toLocaleLowerCase()),
      )
    }

    if (typeOfSearch.value === 'item') {
      items = items.filter((item: ItemTable) =>
        item.singleItem.item.name
          .toLocaleLowerCase()
          .includes(search.value.toLocaleLowerCase()),
      )
    }
  }

  return items
})
</script>

<template>
  <div class="row">
    <div class="col-auto">
      <q-input
        v-model="search"
        type="search"
        dense
        standout
        filled
        style="font-size: 12px !important; width: 320px"
        class="q-mr-xl q-pr-none typeOfSearch"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>

        <template #append>
          <q-select
            v-model="typeOfSearch"
            :options="typeOfSearchCatalog"
            option-value="id"
            option-label="name"
            dense
            flat
            emit-value
            map-options
            @update:model-value="search = ''"
          />
        </template>
      </q-input>
    </div>
    <div class="col-auto">
      <q-select
        v-model="filteredReturnedStatus"
        :options="returnedStatusCatalog"
        label="Filtrar por estatus devuelto:"
        option-value="id"
        option-label="name"
        style="width: 200px"
        borderless
        dense
        emit-value
        map-options
        clearable
        class="q-mr-md"
      />
    </div>
    <div class="col-auto">
      <q-select
        v-model="filteredCategories"
        :options="categoriesCatalog"
        label="Filtrar por categoría:"
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
        title="Préstamos"
        :rows="getItems"
        :columns="columns"
        :pagination="{ rowsPerPage: 20 }"
        row-key="idBorrowing"
      >
        <template #body-cell-returned="{ value }">
          <q-td>
            <q-icon
              :name="value ? 'check' : 'close'"
              :color="value ? 'green' : 'red'"
              size="sm"
              class="q-mx-auto"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<style>
.typeOfSearch > div > div {
  padding-right: 0 !important;
}

.q-field__native > span {
  padding-left: 6px;
  font-size: 12px !important;
  color: #00000099;
}
</style>
