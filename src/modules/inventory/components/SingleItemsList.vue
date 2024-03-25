<script setup lang="ts">
import SingleItemsStore from '../stores/single-item-store'

interface Props {
  singleItemsAmount: number
  singleItemStatusCatalog: Array<{ idSingleItemStatus: number; name: string }>
}

const props = defineProps<Props>()
</script>

<template>
  <q-list>
    <q-item v-for="item in props.singleItemsAmount" :key="item" class="q-px-sm">
      <q-item-section class="q-py-sm">
        <div class="row items-center q-col-gutter-x-lg dense">
          <div class="col-12 col-sm-2">
            <span class="d-block text-subtitle2">Pieza {{ item }}</span>
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              type="textarea"
              v-model="SingleItemsStore.store[item - 1].comments"
              label="Comentarios"
              autogrow
            />
          </div>
          <div class="col-6 col-sm-3">
            <q-select
              v-model="SingleItemsStore.store[item - 1].singleItemStatus"
              :options="singleItemStatusCatalog"
              label="Estado"
              option-value="idSingleItemStatus"
              option-label="name"
            />
          </div>
          <div class="col-6 col-sm-3">
            <q-file
              v-model="SingleItemsStore.store[item - 1].image"
              label="Imagen"
              accept=".jpg, .png, .jpeg, image/*"
            >
              <template v-slot:append>
                <q-icon size="sm" name="image" />
              </template>
            </q-file>
          </div>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>
