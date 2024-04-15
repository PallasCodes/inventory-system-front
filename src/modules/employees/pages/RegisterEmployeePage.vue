<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { handleRequest } from 'src/utils/handleRequest'
import { notEmpty } from 'src/utils/formValidations'
import { Loading, QForm } from 'quasar'
import { DepartmentService } from 'src/api/department.api'
import { BranchService } from 'src/api/branch.api'
import { Branch, Department } from '../interfaces'
import { EmployeeService } from 'src/api/employee.api'
import { useRoute, useRouter } from 'vue-router'

interface FormData {
  idEmployee?: string | null
  fullName: string
  idDepartment: string
  idBranch?: string
}

const route = useRoute()

const branches = ref<Branch[]>()
const departments = ref<Department[]>()

const router = useRouter()

const idEmployeeToUpdate = ref<string>('')

const formData = ref<FormData>({
  idEmployee: null,
  fullName: '',
  idBranch: '',
  idDepartment: '',
})

const updatePage = computed(() => {
  return route.meta.updatePage
})

async function registerEmployee() {
  Loading.show()

  const { message, error } = await handleRequest(EmployeeService.create, {
    fullName: formData.value.fullName,
    idDepartment: formData.value.idDepartment,
  })

  Loading.hide()
  message?.display()

  if (!error) router.replace({ name: 'employees' })
}

onMounted(async () => {
  getBranches()

  if (route.meta.updatePage) {
    idEmployeeToUpdate.value = route.params.idEmployee as string
    await getEmployeeData(idEmployeeToUpdate.value)
    onSelectBranch()
  }
})

async function getEmployeeData(idEmployee: string) {
  Loading.show()

  const { data, message, error } = await handleRequest(
    EmployeeService.findOne,
    idEmployee,
  )

  Loading.hide()

  if (error) {
    message?.display()
  } else {
    formData.value = {
      idEmployee: data.idEmployee,
      fullName: data.fullName,
      idDepartment: data.department.idDepartment,
      idBranch: data.department.branch.idBranch,
    }
  }
}

async function getBranches() {
  Loading.show()
  const { data, error, message } = await handleRequest(BranchService.findAll)

  Loading.hide()

  if (!error) {
    branches.value = data as Branch[]
  } else {
    message?.display()
  }
}

async function onSelectBranch() {
  const { data, message, error } = await handleRequest(
    DepartmentService.findAllById,
    formData.value.idBranch,
  )

  if (!error) {
    departments.value = data as Department[]
  } else {
    message?.display()
  }
}

async function updateEmployee() {
  Loading.show()

  const { idBranch, ...payload } = formData.value

  const { message, error } = await handleRequest(EmployeeService.update, { ...payload })

  Loading.hide()
  message?.display()

  if (!error) router.replace({ name: 'employees' })
}

function onSubmit() {
  if (updatePage.value) {
    updateEmployee()
  } else {
    registerEmployee()
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
          <q-form @submit.prevent="onSubmit" ref="form">
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
                  v-model="formData.idBranch"
                  @update:model-value="onSelectBranch"
                  :rules="[notEmpty]"
                  :options="branches"
                  label="Sucursal*"
                  option-value="idBranch"
                  option-label="name"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-12">
                <q-select
                  v-model="formData.idDepartment"
                  :rules="[notEmpty]"
                  :options="departments"
                  label="Departamento*"
                  option-value="idDepartment"
                  option-label="name"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-12">
                <q-btn type="submit" color="green">{{
                  updatePage ? 'Editar Empleado' : 'Registrar Empleado'
                }}</q-btn>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
