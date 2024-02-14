<script setup lang="ts">
import { QTableProps } from 'quasar'
import { onMounted, ref } from 'vue'

import { EmployeeService } from 'src/api/employee.api'
import { handleRequest } from 'src/utils/handleRequest'

interface ItemTable {
  idEmployee: string
  fullName: string
  branch: string
}

const employees = ref<ItemTable[]>([])

const columns: QTableProps['columns'] = [
  {
    name: 'fullName',
    label: 'Nombre completo',
    required: false,
    align: 'left',
    sortable: true,
    field: (row) => row.fullName,
    style: 'min-width: 150px',
  },
  {
    name: 'branch',
    label: 'Sucursal',
    align: 'left',
    field: (row) => row.department?.branch?.name,
    required: false,
    sortable: true,
  },
  {
    name: 'department',
    label: 'Departamento',
    align: 'left',
    field: (row) => row.department?.name,
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
  const { data, message, error } = await handleRequest(EmployeeService.findAll)

  if (!error) employees.value = data
})

function onRowClick(evt: Event, row: ItemTable) {
  console.log(row)
}
</script>

<template>
  <q-table
    title="Trabajadores"
    :rows="employees"
    :columns="columns"
    :pagination="{ rowsPerPage: 20 }"
    row-key="idEmployee"
    @row-click="onRowClick"
  ></q-table>
</template>
