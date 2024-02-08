<script setup lang="ts">
import { ref } from 'vue'

import { handleRequest } from 'src/utils/handleRequest'
import { notEmpty } from 'src/utils/formValidations'
import { Loading, QForm, useQuasar } from 'quasar'
import { DepartmentService } from 'src/api/department.api'

const $q = useQuasar()
const form = ref<QForm>()

async function registerDept() {
  Loading.show()

  const { error, message } = await handleRequest(await DepartmentService.create, {
    name: formData.value.name,
  })

  Loading.hide()

  if (error) {
    message?.display()
  } else {
    $q.notify({
      color: 'green',
      textColor: 'white',
      icon: 'check',
      message: 'Departamento registrado con éxito',
    })
    form.value?.resetValidation()
    console.log(form.value)
  }
}
interface FormData {
  name: string
}

const formData = ref<FormData>({
  name: '',
})
</script>

<template>
  <div class="row">
    <div class="col-12">
      <q-card style="max-width: 420px" class="q-px-xs">
        <q-card-section class="q-pb-none">
          <div class="text-subtitle1 text-weight-medium">Departamento</div>
        </q-card-section>
        <q-card-section class="q-pt-sm">
          <q-form @submit.prevent="registerDept" ref="form">
            <div class="row q-gutter-y-sm">
              <div class="col-12">
                <q-input
                  v-model="formData.name"
                  type="text"
                  label="Nombre*"
                  :rules="[notEmpty]"
                />
              </div>
              <div class="col-12">
                <q-btn type="submit" color="primary">Registrar Departamento</q-btn>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
