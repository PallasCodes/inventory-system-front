<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { handleRequest } from 'src/utils/handleRequest'
import { notEmpty, selectNotEmpty } from 'src/utils/formValidations'
import { Loading, QForm, useQuasar } from 'quasar'
import { DepartmentService } from 'src/api/department.api'
import { BranchService } from 'src/api/branch.api'
import { Branch, Department } from '../interfaces'
import { EmployeeService } from 'src/api/employee.api'

interface FormData {
  fullName: string
  department: any
  branch: Branch | null
}

const branches = ref<Branch[]>()
const departments = ref<Department[]>()

const formData = ref<FormData>({
  fullName: '',
  branch: null,
  department: null,
})

async function registerEmployee() {
  const { data, message, error } = await handleRequest(EmployeeService.create, {
    fullName: formData.value.fullName,
    idDepartment: formData.value.department.idDepartment,
  })

  if (!error) {
    console.log(data)
  }
}

onMounted(async () => {
  const { data, error, message } = await handleRequest(BranchService.findAll)

  if (!error) {
    branches.value = data as Branch[]
  }
})

async function onSelectBranch() {
  console.log('idbranch: ' + formData.value.branch?.idBranch)

  const { data, message, error } = await handleRequest(
    DepartmentService.findAllById,
    formData.value.branch?.idBranch,
  )

  if (!error) {
    departments.value = data as Department[]
  }
}
</script>

<template>
  <div class="row">
    <div class="col-12">
      <q-card style="max-width: 420px" class="q-px-xs">
        <q-card-section class="q-pb-none">
          <div class="text-subtitle1 text-weight-medium">Empleado</div>
        </q-card-section>
        <q-card-section class="q-pt-sm">
          <q-form @submit.prevent="registerEmployee" ref="form">
            <div class="row q-gutter-y-sm">
              <div class="col-12">
                <q-input
                  v-model="formData.fullName"
                  type="text"
                  label="Nombre completo*"
                  :rules="[notEmpty]"
                />
              </div>
              <div class="col-12">
                <q-select
                  v-model="formData.branch"
                  label="Sucursal*"
                  :rules="[selectNotEmpty]"
                  :options="branches"
                  option-value="idBranch"
                  option-label="name"
                  @update:model-value="onSelectBranch"
                />
              </div>
              <div class="col-12">
                <q-select
                  v-model="formData.department"
                  label="Departamento*"
                  :rules="[selectNotEmpty]"
                  :options="departments"
                  option-value="idDepartment"
                  option-label="name"
                />
              </div>
              <div class="col-12">
                <q-btn type="submit" color="green">Registrar Empleado</q-btn>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
