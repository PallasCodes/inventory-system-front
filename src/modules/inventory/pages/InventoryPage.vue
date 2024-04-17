<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Loading } from 'quasar'

import { ItemService } from 'src/api/item.api'
import { handleRequest } from 'src/utils/handleRequest'
import { ItemTable } from '../components/ItemsTable.vue'

import ItemsInfoCardsList, { ItemCard } from '../components/ItemsInfoCardsList.vue'
import ItemsTableWithDetails from '../components/ItemsTableWithDetails.vue'

onMounted(async () => {
  Loading.show()

  await Promise.all([getItems(), getItemsCount()])

  Loading.hide()
})

const isTableDataLoading = ref<boolean>(true)
const items = ref<ItemTable[]>([])

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
  }
}

function onDeleteSingleItem(idSingleItemStatus: number) {
  itemCards.value[0].amount -= 1
  itemCards.value[idSingleItemStatus].amount -= 1
}
</script>

<template>
  <ItemsInfoCardsList :items-cards="itemCards" class="q-mb-xl" />

  <ItemsTableWithDetails
    :items="items"
    :is-table-data-loading="isTableDataLoading"
    @delete-item="getItemsCount"
    @delete-single-item="onDeleteSingleItem"
  />
</template>
