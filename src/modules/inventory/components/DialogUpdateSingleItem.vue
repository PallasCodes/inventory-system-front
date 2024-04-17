<script setup lang="ts">
import { defineModel, defineProps, ref, watch } from 'vue'
import { ItemTable } from './ItemsTable.vue'
import { SingleItemTable } from './SingleItemsTable.vue'
import { SingleItemStatusRegisterCat } from '../interfaces/SingleItemStatus.catalog'
import { Loading, useQuasar } from 'quasar'
import { handleRequest } from 'src/utils/handleRequest'
import { SingleItemService } from 'src/api/single-item.api'
import { makeAPICall } from 'src/utils/imgBb'

const $q = useQuasar()

const emit = defineEmits(['update'])

const isDialogActive = defineModel<boolean>({ default: false, type: Boolean })

interface Props {
  item?: ItemTable
  singleItem?: SingleItemTable
}

export interface SingleItemUpdateForm {
  sku?: string | null
  idSingleItemStatus: number | null
  image?: File | null
  comments?: string | null
  imgUrl?: string | null
}

const props = defineProps<Props>()

watch(
  () => props.singleItem,
  () => {
    formData.value = {
      sku: props.singleItem?.sku,
      idSingleItemStatus: props.singleItem?.singleItemStatus.idSingleItemStatus || null,
      image: null,
      comments: props.singleItem?.comments,
    }
  },
)

async function getImgUrl(): Promise<string> {
  const formPayload = new FormData()

  formPayload.append('name', 'singleItem_' + formData.value.sku)
  formPayload.append('image', formData.value.image as File)
  formPayload.append('key', '984cd4fb80b1dece88ef94d4ab376823')

  try {
    const { data } = await makeAPICall({
      image: formData.value.image,
      name: 'singleItem__' + formData.value.sku,
    })

    return data.data.thumb.url
  } catch (error) {
    console.error(error)
    return 'error'
  }
}

const formData = ref<SingleItemUpdateForm>({
  sku: null,
  idSingleItemStatus: null,
  image: null,
  comments: null,
})

async function onSubmit() {
  Loading.show()

  if (formData.value?.image) {
    const imgUrl = await getImgUrl()

    if (imgUrl === 'error') {
      $q.dialog({
        title: 'Ocurrió un error al actualizar el item. Inténtalo más tarde',
        color: 'negative',
      })

      delete formData.value.imgUrl
    } else {
      formData.value.imgUrl = imgUrl
    }
  } else {
    delete formData.value.imgUrl
  }
  const { image, ...payload } = formData.value

  const { data, error, message } = await handleRequest(SingleItemService.update, {
    ...payload,
  })

  Loading.hide()
  message?.display()

  if (!error) emit('update', data)
}
</script>

<template>
  <q-dialog v-model="isDialogActive" persistent>
    <q-card class="q-pa-sm">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ `Editar: ${item?.name} - ${singleItem?.sku}` }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col-12">
            <q-select
              v-model="formData.idSingleItemStatus"
              :options="SingleItemStatusRegisterCat"
              label="Estado*"
              option-value="idSingleItemStatus"
              option-label="name"
              map-options
              emit-value
            />
          </div>
          <div class="col-12">
            <q-file
              v-model="formData.image"
              label="Imagen"
              accept=".jpg, .png, .jpeg, image/*"
            >
              <template v-slot:append>
                <q-icon size="sm" name="image" />
              </template>
            </q-file>
          </div>
          <div class="col-12">
            <q-input
              type="textarea"
              v-model="formData.comments"
              label="Comentarios"
              autogrow
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="grey" v-close-popup />
        <q-btn flat label="Actualizar" color="positive" v-close-popup @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
