<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { ItemService } from 'src/api/item.api'
import { handleRequest } from 'src/utils/handleRequest'

import ItemsInfoCardsList, { ItemCard } from '../components/ItemsInfoCardsList.vue'
import ItemsTable, { ItemTable } from '../components/ItemsTable.vue'
import SingleItemsTable, { SingleItemTable } from '../components/SingleItemsTable.vue'
import { Loading } from 'quasar'

const search = ref<string>('')
const filteredCategories = ref<string[]>([])
const filteredStates = ref<string[]>([])

const itemCards = ref<ItemCard[]>([
  {
    amount: 0,
    color: 'primary',
    icon: 'analytics',
    description: 'Total de items',
    name: 'totals',
  },
  {
    amount: 0,
    color: 'positive',
    icon: 'check',
    description: 'Items disponibles',
    name: 'available',
  },
  {
    amount: 0,
    color: 'negative',
    icon: 'close',
    description: 'Items no disponibles',
    name: 'not_available',
  },
  {
    amount: 0,
    color: 'secondary',
    icon: 'real_estate_agent',
    description: 'Items prestados',
    name: 'borrowed',
  },
  {
    amount: 0,
    color: 'orange',
    icon: 'build',
    description: 'Items en reparación',
    name: 'fixing',
  },
])

const items = ref<ItemTable[]>([])
const singleItems = ref<SingleItemTable[]>([])

const isTableDataLoading = ref<boolean>(true)
const selectedItemName = ref<string>('')

function selectFirstRow() {
  const rows = document.querySelectorAll('.q-table .cursor-pointer')
  if (rows.length >= 1) (rows[0] as HTMLTableRowElement).click()
}

onMounted(async () => {
  Loading.show()

  await Promise.all([getItems(), getItemsCount()])

  Loading.hide()
})

async function onClickRow(idItem: string) {
  selectedItemName.value = items.value.find((item) => item.idItem === idItem)
    ?.name as string
  const { data } = await handleRequest(ItemService.findOneById, idItem)
  singleItems.value = data.singleItems as SingleItemTable[]
}

async function getItemsCount() {
  const { data, message, error } = await handleRequest(ItemService.getItemsCount)

  if (error) {
    message?.display()
  } else {
    itemCards.value.forEach((itemCard: ItemCard) => {
      itemCard.amount = data[itemCard.name]
    })
  }
}

async function getItems() {
  const { data } = await handleRequest(ItemService.findAll)
  isTableDataLoading.value = false
  items.value = data as ItemTable[]

  setTimeout(selectFirstRow, 500)
}
</script>

<template>
  <ItemsInfoCardsList :items-cards="itemCards" class="q-mb-xl" />

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
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div class="col-auto">
      <q-select
        borderless
        v-model="filteredCategories"
        :options="[]"
        label="Filtrar por estatus"
        dense
        style="width: 160px"
        class="q-mr-lg"
      />
    </div>
    <div class="col-auto">
      <q-select
        borderless
        v-model="filteredStates"
        :options="[]"
        label="Filtrar por categoría"
        dense
        style="width: 160px"
      />
    </div>
  </div>

  <div class="row q-mt-lg">
    <div class="col-auto">
      <ItemsTable
        :items="items"
        :is-loading="isTableDataLoading"
        @on-row-click="onClickRow"
      />
    </div>
  </div>

  <div class="row q-mt-lg">
    <SingleItemsTable
      :single-items="singleItems"
      :is-loading="isTableDataLoading"
      :item-name="selectedItemName"
    />
  </div>
</template>
