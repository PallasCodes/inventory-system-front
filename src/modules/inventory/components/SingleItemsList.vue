<script setup lang="ts">
import SingleItemsStore from '../stores/single-item-store'

interface Props {
  singleItemsAmount: number
}

const props = defineProps<Props>()
</script>

<template>
  <q-card
    v-for="item in props.singleItemsAmount"
    :key="item"
    class="q-pa-sm"
    :class="item > 1 ? 'q-mt-md' : null"
  >
    <q-card-section>
      <div>
        <div class="col-12">
          <span class="d-block">Item {{ item }}</span>
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
            v-model="SingleItemsStore.store[item - 1].state"
            :options="['available', 'unavailable', 'fixing']"
            label="Estado"
          ></q-select>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
