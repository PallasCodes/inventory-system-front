<script setup lang="ts">
import SingleItemsStore from '../stores/single-item-store'

export interface SingleItemStatus {
  idSingleItemStatus: string
  nombre: string
}

interface Props {
  singleItemsAmount: number
  singleItemStatusesCatalog: SingleItemStatus[]
}

const props = defineProps<Props>()
</script>

<template>
  <q-list bordered class="q-pa-sm">
    <q-item
      v-for="item in props.singleItemsAmount"
      :key="item"
      class="q-pa-sm"
      :class="item > 1 ? 'q-mt-md' : null"
    >
      <q-item-section>
        <div>
          <div class="col-12">
            <span class="d-block text-subtitle2">Pieza {{ item }}</span>
          </div>
          <div class="col-12">
            <q-input
              type="textarea"
              v-model="SingleItemsStore.store[item - 1].comments"
              label="Comentarios"
              autogrow
            />
          </div>
          <div class="col-12">
            <q-select
              v-model="SingleItemsStore.store[item - 1].singleItemStatus"
              :options="singleItemStatusesCatalog"
              label="Estado"
              option-value="idSingleItemStatus"
              option-label="name"
            ></q-select>
          </div>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>
