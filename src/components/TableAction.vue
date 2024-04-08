<script setup lang="ts">
interface Props {
  icon: string
  iconColor: string
  label: string
}

defineProps<Props>()
</script>

<template>
  <q-btn flat round size="sm" class="tableActionIcon" :color="iconColor">
    <q-icon :name="icon" :color="iconColor" />
    <q-tooltip
      anchor="top middle"
      self="bottom middle"
      :offset="[5, 5]"
      top
      style="font-size: 12px"
    >
      {{ label }}
    </q-tooltip>
  </q-btn>
</template>

<style>
.tableActionIcon i {
  filter: brightness(0%) !important;
  opacity: 0.5;
}

.tableActionIcon:hover i {
  filter: brightness(100%) !important;
  opacity: 1;
}
</style>
