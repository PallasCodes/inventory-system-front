<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { ItemService } from 'src/api/item.api'
import { handleRequest } from 'src/utils/handleRequest'

import ItemsInfoCardsList, { ItemCard } from '../components/ItemsInfoCardsList.vue'
import ItemsTable, { ItemTable } from '../components/ItemsTable.vue'
import SingleItemsTable, { SingleItemTable } from '../components/SingleItemsTable.vue'
import { Loading } from 'quasar'

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
const selectedItem = ref<ItemTable>()

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
  selectedItem.value = items.value.find((item) => item.idItem === idItem)
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
  const { data, error, message } = await handleRequest(ItemService.findAll)

  isTableDataLoading.value = false

  if (error) {
    message?.display()
    items.value = []
  } else {
    items.value = data as ItemTable[]
    setTimeout(selectFirstRow, 500)
  }
}

function onDeleteSI(payload: { singleItem: SingleItemTable; item: ItemTable }) {
  singleItems.value = singleItems.value.filter(
    (singleItem: SingleItemTable) => singleItem.sku !== payload.singleItem.sku,
  )
  const i = items.value.findIndex((i: ItemTable) => i.idItem === payload.item.idItem)

  items.value[i].numTotalItems -= 1

  if (payload.singleItem.singleItemStatus.idSingleItemStatus === 1) {
    items.value[i].numAvailableItems -= 1
  }
  if (payload.singleItem.singleItemStatus.idSingleItemStatus === 2) {
    items.value[i].numUnavailableItems -= 1
  }
  if (payload.singleItem.singleItemStatus.idSingleItemStatus === 3) {
    items.value[i].numBorrowedItems -= 1
  }
  if (payload.singleItem.singleItemStatus.idSingleItemStatus === 4) {
    items.value[i].numFixingItems -= 1
  }
  // update item table after delete
}

function onDeleteItem(idItem: string) {
  items.value = items.value.filter((item: ItemTable) => item.idItem !== idItem)
  selectFirstRow()
}
</script>

<template>
  <ItemsInfoCardsList :items-cards="itemCards" class="q-mb-xl" />

  <ItemsTable
    :items="items"
    :is-loading="isTableDataLoading"
    @on-row-click="onClickRow"
    @delete="onDeleteItem"
  />

  <SingleItemsTable
    :single-items="singleItems"
    :is-loading="isTableDataLoading"
    :item="selectedItem"
    @delete="onDeleteSI"
  />
</template>
