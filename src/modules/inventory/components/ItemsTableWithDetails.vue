<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { ItemService } from 'src/api/item.api'
import { handleRequest } from 'src/utils/handleRequest'

import ItemsTable, { ItemTable } from '../components/ItemsTable.vue'
import SingleItemsTable, { SingleItemTable } from '../components/SingleItemsTable.vue'

interface Props {
  items: ItemTable[]
  isTableDataLoading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits(['deleteItem', 'deleteSingleItem'])

watch(
  () => props.items,
  () => {
    itemsAux.value = props.items
    if (props.items.length > 0) {
      setTimeout(selectFirstRow, 500)
    } else {
      isSITableDataLoading.value = false
    }
  },
)

const selectedItem = ref<ItemTable>()
const isSITableDataLoading = ref<boolean>(true)
const singleItems = ref<SingleItemTable[]>([])
const singleItemsAux = ref<SingleItemTable[]>([])
const itemsAux = ref<ItemTable[]>([])

async function onClickRow(idItem: string) {
  selectedItem.value = itemsAux.value.find((item) => item.idItem === idItem)

  const { data, error, message } = await handleRequest(ItemService.findOneById, idItem)

  isSITableDataLoading.value = false

  if (!error) {
    singleItems.value = data.singleItems as SingleItemTable[]
    singleItemsAux.value = data.singleItems as SingleItemTable[]
  } else {
    message?.display()
    singleItems.value = []
  }
}

function onDeleteSI(payload: { singleItem: SingleItemTable; item: ItemTable }) {
  emit('deleteSingleItem', payload.singleItem.singleItemStatus.idSingleItemStatus)

  singleItems.value = singleItems.value?.filter(
    (singleItem: SingleItemTable) => singleItem.sku !== payload.singleItem.sku,
  )
  const i = itemsAux.value.findIndex((i: ItemTable) => i.idItem === payload.item.idItem)

  itemsAux.value[i].numTotalItems -= 1

  if (payload.singleItem.singleItemStatus.idSingleItemStatus === 1) {
    itemsAux.value[i].numAvailableItems -= 1
  }
  if (payload.singleItem.singleItemStatus.idSingleItemStatus === 2) {
    itemsAux.value[i].numUnavailableItems -= 1
  }
  if (payload.singleItem.singleItemStatus.idSingleItemStatus === 3) {
    itemsAux.value[i].numBorrowedItems -= 1
  }
  if (payload.singleItem.singleItemStatus.idSingleItemStatus === 4) {
    itemsAux.value[i].numFixingItems -= 1
  }
}

function onDeleteItem(idItem: string) {
  emit('deleteItem')
  itemsAux.value = itemsAux.value.filter((item: ItemTable) => item.idItem !== idItem)
  selectFirstRow()
}

function selectFirstRow() {
  const rows = document.querySelectorAll('.q-table .cursor-pointer')
  if (rows.length >= 1) (rows[0] as HTMLTableRowElement).click()
}

function onUpdateSI(singleItem: SingleItemTable) {
  const i = singleItems.value.findIndex(
    (si: SingleItemTable) => si.sku === singleItem.sku,
  )
  singleItems.value[i] = { ...singleItem }
}

function onUpdateItem(item: ItemTable) {
  const i = itemsAux.value.findIndex(
    (itemAux: ItemTable) => itemAux.idItem === item.idItem,
  )
  itemsAux.value[i] = { ...item }
}

function updateSingleItems(items: ItemTable[]) {
  const item = items.find((i: ItemTable) => i.idItem === selectedItem.value?.idItem)

  if (!item) {
    singleItemsAux.value = []
  } else {
    singleItemsAux.value = singleItems.value
  }
}
</script>

<template>
  <ItemsTable
    :items="itemsAux"
    :is-loading="isTableDataLoading"
    @on-row-click="onClickRow"
    @delete="onDeleteItem"
    @update="onUpdateItem"
    @search="updateSingleItems"
  />
  <SingleItemsTable
    :single-items="singleItemsAux"
    :is-loading="isSITableDataLoading"
    :item="selectedItem"
    @delete="onDeleteSI"
    @update="onUpdateSI"
  />
</template>
