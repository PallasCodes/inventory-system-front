<script setup lang="ts">
import { defineModel, defineProps, defineEmits } from 'vue'

const emit = defineEmits(['onDelete'])

const isDialogActive = defineModel<boolean>({ default: false, type: Boolean })

interface Props {
  title: string
}

const props = defineProps<Props>()
</script>

<template>
  <q-dialog v-model="isDialogActive" persistent>
    <q-card class="q-pa-sm">
      <q-card-section class="row items-center">
        <q-avatar icon="delete" color="negative" text-color="white" />
        <span class="q-ml-sm">{{ props.title }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="grey" v-close-popup />
        <q-btn
          flat
          label="Eliminar"
          color="negative"
          v-close-popup
          @click="emit('onDelete')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
