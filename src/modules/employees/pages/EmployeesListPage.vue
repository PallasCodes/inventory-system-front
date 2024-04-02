<script setup lang="ts">
import { Loading, QTableProps } from 'quasar'
import { computed, onMounted, ref } from 'vue'

import { EmployeeService } from 'src/api/employee.api'
import { handleRequest } from 'src/utils/handleRequest'
import { BranchService } from 'src/api/branch.api'
import { DepartmentService } from 'src/api/department.api'

interface ItemTable {
  id_employee: string
  full_name: string
  branch: string
  department: string
  id_branch: string
  id_department: string
}

const employees = ref<ItemTable[]>([])

const columns: QTableProps['columns'] = [
  {
    name: 'full_name',
    label: 'Nombre completo',
    required: false,
    align: 'left',
    sortable: true,
    field: 'full_name',
    style: 'min-width: 150px',
  },
  {
    name: 'branch',
    label: 'Sucursal',
    align: 'left',
    field: 'branch',
    required: false,
    sortable: true,
  },
  {
    name: 'department',
    label: 'Departamento',
    align: 'left',
    field: 'department',
    required: false,
    sortable: true,
  },
  {
    name: 'numItems',
    label: 'No. de prestamos actuales',
    align: 'left',
    field: 'numItems',
    required: false,
    sortable: true,
  },
]

onMounted(async () => {
  Loading.show()

  await Promise.all([getEmployees(), getBranchesCatalog()])

  Loading.hide()
})

async function getEmployees() {
  const { data, message, error } = await handleRequest(EmployeeService.findAll)

  if (!error) {
    employees.value = data
  } else {
    message?.display()
  }
}

async function getBranchesCatalog() {
  const { data, message, error } = await handleRequest(BranchService.findAll)

  if (error) {
    message?.display()
  } else {
    branchesCatalog.value = data
  }
}

async function getDepartmentsCatalog(idBranch: string) {
  departmentsCatalog.value = []

  if (!idBranch) return

  const { data, message, error } = await handleRequest(
    DepartmentService.findAllById,
    idBranch,
  )

  if (error) {
    message?.display()
  } else {
    departmentsCatalog.value = data
  }
}

function onRowClick(evt: Event, row: ItemTable) {
  console.log(row)
}

const search = ref<string>('')
const branchesCatalog = ref()
const filteredBranches = ref<any[]>([])
const typeOfSearch = ref<string>('employee')
const typeOfSearchCatalog = ref([
  { name: 'Departamento', id: 'department' },
  { name: 'Sucursal', id: 'branch' },
  { name: 'Empleado', id: 'employee' },
])
const filteredDepartments = ref<any[]>([])
const departmentsCatalog = ref()

const getItems = computed(() => {
  let items = employees.value

  if (filteredBranches.value?.length > 0) {
    items = items.filter((item: ItemTable) =>
      filteredBranches.value.includes(item.id_branch),
    )
  }

  if (filteredDepartments.value?.length > 0) {
    items = items.filter((item: ItemTable) =>
      filteredDepartments.value.includes(item.id_department),
    )
  }

  if (search.value !== '') {
    if (typeOfSearch.value === 'employee') {
      items = items.filter((item: ItemTable) =>
        item.full_name.toLowerCase().includes(search.value.toLocaleLowerCase()),
      )
    }

    if (typeOfSearch.value === 'branch') {
      items = items.filter((item: ItemTable) =>
        item.branch.toLowerCase().includes(search.value.toLocaleLowerCase()),
      )
    }

    if (typeOfSearch.value === 'department') {
      items = items.filter((item: ItemTable) =>
        item.department.toLowerCase().includes(search.value.toLocaleLowerCase()),
      )
    }
  }

  return items
})
</script>

<template>
  <div class="row">
    <div class="col-auto">
      <q-input
        v-model="search"
        type="search"
        dense
        standout
        filled
        style="font-size: 12px !important; width: 320px"
        class="q-mr-xl q-pr-none typeOfSearch"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>

        <template #append>
          <q-select
            v-model="typeOfSearch"
            :options="typeOfSearchCatalog"
            option-value="id"
            option-label="name"
            dense
            flat
            emit-value
            map-options
            @update:model-value="search = ''"
          />
        </template>
      </q-input>
    </div>
    <div class="col-auto">
      <q-select
        v-model="filteredBranches"
        :options="branchesCatalog"
        label="Filtrar por sucursal:"
        option-value="idBranch"
        option-label="name"
        style="width: 200px"
        borderless
        dense
        emit-value
        map-options
        clearable
        multiple
        @update:model-value="getDepartmentsCatalog"
      />
    </div>
    <div class="col-auto">
      <q-select
        v-model="filteredDepartments"
        :options="departmentsCatalog"
        label="Filtrar por departamento:"
        option-value="idDepartment"
        option-label="name"
        style="width: 200px"
        borderless
        dense
        emit-value
        map-options
        clearable
        multiple
      />
    </div>
  </div>

  <div class="row q-mt-lg">
    <div class="col-auto">
      <q-table
        title="Trabajadores"
        :rows="getItems"
        :columns="columns"
        :pagination="{ rowsPerPage: 20 }"
        row-key="idEmployee"
        @row-click="onRowClick"
      />
    </div>
  </div>
</template>

<style>
.typeOfSearch > div > div {
  padding-right: 0 !important;
}

.q-field__native > span {
  padding-left: 6px;
  font-size: 12px !important;
  color: #00000099;
}
</style>
