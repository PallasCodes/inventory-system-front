<script setup lang="ts">
import { defineModel, defineProps, onMounted, ref, watch } from 'vue'
import { Loading, QForm } from 'quasar'

import { notEmpty } from 'src/utils/formValidations'
import { ItemService } from 'src/api/item.api'
import { Category } from '../interfaces/Category'
import { handleRequest } from 'src/utils/handleRequest'

import { ItemTable } from './ItemsTable.vue'
import { CategoryService } from 'src/api/category.api'

const emit = defineEmits(['update'])

const categories = ref<Category[]>([])

const isDialogActive = defineModel<boolean>({ default: false, type: Boolean })

interface Props {
  item?: ItemTable
}

const props = defineProps<Props>()

export interface UpdateItemFormData {
  idItem?: string | null
  name?: string | null
  description?: string | null
  categoriesIds?: Category[] | null
}

const formData = ref<UpdateItemFormData>({
  idItem: null,
  name: null,
  description: null,
  categoriesIds: [],
})

watch(
  () => props.item,
  () => {
    formData.value = {
      idItem: props.item?.idItem,
      name: props.item?.name,
      description: props.item?.description,
      categoriesIds: props.item?.categories,
    }
  },
)

async function onSubmit() {
  Loading.show()

  const payload = {
    ...formData.value,
    categoriesIds: formData.value.categoriesIds?.map((c: Category) => c.idCategory),
  }

  const { data, error, message } = await handleRequest(ItemService.update, payload)

  Loading.hide()
  message?.display()

  if (!error) emit('update', data)
}

onMounted(async () => {
  const { data, message, error } = await handleRequest(CategoryService.findAll)

  if (error) {
    message?.display()
  } else {
    categories.value = data as Category[]
  }
})
</script>

<template>
  <q-dialog v-model="isDialogActive" persistent>
    <q-card class="q-pa-sm">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ `Editar: ${item?.name}` }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form ref="form">
          <div class="row q-gutter-sm">
            <div class="col-12">
              <q-input
                v-model="formData.name"
                type="text"
                label="Nombre*"
                :rules="[notEmpty]"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="formData.description"
                type="textarea"
                label="Descripción"
                autogrow
                :rows="3"
              />
            </div>
            <div class="col-12">
              <q-select
                v-model="formData.categoriesIds"
                :options="categories"
                :rules="[notEmpty]"
                label="Categorías*"
                multiple
                use-chips
                option-value="id"
                option-label="name"
                map-options
                emit-value
              />
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="grey" v-close-popup />
        <q-btn flat label="Actualizar" color="positive" v-close-popup @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
