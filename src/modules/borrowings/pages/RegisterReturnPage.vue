<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Loading } from 'quasar'

import { formatters } from 'src/utils/formatters'
import { Borrowing } from '../interfaces/Borrowing'
import { BorrowingsService } from 'src/api/borrowings.api'
import { handleRequest } from 'src/utils/handleRequest'
import { notEmpty } from 'src/utils/formValidations'
import { useRouter } from 'vue-router'

const router = useRouter()

export interface RegisterReturnForm {
  borrowingReturn: string | null
  idBorrowing: string | null
  comments?: string | null
}

const formData = ref<RegisterReturnForm>({
  borrowingReturn: formatters.dateToString(new Date()),
  idBorrowing: null,
  comments: null,
})

const dueBorrowings = ref<Borrowing[]>()

onMounted(async () => {
  const { data, error, message } = await handleRequest(
    BorrowingsService.listDueBorrowings,
  )

  if (error) {
    message?.display()
  } else {
    dueBorrowings.value = data
  }
})

async function onSubmit() {
  Loading.show()

  const { message, error } = await handleRequest(
    BorrowingsService.registerReturn,
    formData.value,
  )

  Loading.hide()

  message?.display()

  if (!error) {
    router.replace({ name: 'borrowings' })
  }
}
</script>

<template>
  <q-card style="max-width: 500px; width: 100%" class="q-pa-md">
    <q-card-section>
      <q-form @submit.prevent="onSubmit">
        <div class="row q-gutter-sm">
          <div class="col-12">
            <span
              class="block text-subtitle2"
              style="font-size: 16px !important; color: #222 !important"
              >Registrar entrega</span
            >
          </div>
          <div class="col-12">
            <q-input
              v-model="formData.borrowingReturn"
              label="Fecha de retorno*"
              type="date"
            />
          </div>
          <div class="col-12">
            <q-select
              v-model="formData.idBorrowing"
              label="Item a retornar*"
              :rules="[notEmpty]"
              :options="dueBorrowings"
              option-value="idBorrowing"
              :option-label="
                (i) =>
                  `${i.singleItem.sku} - ${i.singleItem.item.name} - ${i.employee.fullName}`
              "
              emit-value
              map-options
            />
          </div>
          <div class="col-12">
            <q-input
              v-model="formData.comments"
              type="textarea"
              label="Comentarios"
              no-resize
              :rows="3"
              auto-grow
            />
          </div>
          <div class="col-12">
            <q-btn type="submit" color="green" class="q-mt-md" size="md">Registrar</q-btn>
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
