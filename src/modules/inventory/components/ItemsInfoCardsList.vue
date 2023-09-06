<script setup lang="ts">
export interface ItemCard {
  icon: string
  amount: number
  description: string
  color: string
}

interface Props {
  itemsCards: ItemCard[]
}

const props = defineProps<Props>()
</script>

<template>
  <div class="row q-col-gutter-md">
    <div
      class="col-12 col-sm-auto col-auto"
      v-for="itemCard in props.itemsCards"
      :key="itemCard.description"
    >
      <q-card dark :class="`bg-${itemCard.color}`" style="min-width: 240px">
        <q-card-section class="q-px-lg">
          <div class="row items-center">
            <div class="col-3 q-mr-sm">
              <q-icon :name="itemCard.icon" size="42px" />
            </div>
            <div class="col-auto">
              <span class="block font-weight-bold" style="font-size: 28px">{{
                itemCard.amount
              }}</span>
              <span class="block">{{ itemCard.description }}</span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
