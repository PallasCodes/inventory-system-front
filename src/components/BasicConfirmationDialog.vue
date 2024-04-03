<script setup lang="ts">
import { defineModel, defineProps, defineEmits } from 'vue'

const emit = defineEmits(['confirm'])

const isDialogActive = defineModel<boolean>({ default: false, type: Boolean })

interface Props {
  title: string
  actionBtnLabel: string
  actionBtnColor: string
  cancelBtnLabel?: string | null
  item?: any
}

defineProps<Props>()
</script>

<template>
  <q-dialog v-model="isDialogActive">
    <q-card class="q-pa-sm">
      <q-card-section class="row items-center">
        <span>{{ title }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="cancelBtnLabel || 'Cancelar'" color="grey" v-close-popup />
        <q-btn
          flat
          :label="actionBtnLabel"
          :color="actionBtnColor"
          @click="emit('confirm', item)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
