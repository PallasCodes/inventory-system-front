<script setup lang="ts">
import { QTableProps } from 'quasar'
import { BorrowingsService } from 'src/api/borrowings.api'
import { formatters } from 'src/utils/formatters'
import { AxiosCustomResponse, handleRequest } from 'src/utils/handleRequest'
import { defineModel, ref } from 'vue'

interface Props {
  title: string
}

const props = defineProps<Props>()

const model = defineModel<boolean>()

const columns: QTableProps['columns'] = [
  {
    name: 'borrowingDate',
    label: 'Fecha prestamo',
    required: true,
    align: 'left',
    sortable: true,
    field: (row) => formatters.isoToRegularDate(row.borrowingDate),
  },
  {
    name: 'borrowingDeadline',
    label: 'Fecha acordada retorno',
    required: true,
    align: 'left',
    sortable: true,
    field: (row) => formatters.isoToRegularDate(row.borrowingDeadline),
  },
  {
    name: 'returnDate',
    label: 'Fecha de retorno',
    required: true,
    align: 'left',
    sortable: true,
    field: (row) => formatters.isoToRegularDate(row.returnDate),
  },
  {
    name: 'employee',
    label: 'Empleado',
    required: true,
    align: 'left',
    sortable: true,
    field: (row) => row.employee?.fullName,
  },
  {
    name: 'department',
    label: 'Departamento',
    required: true,
    align: 'left',
    sortable: true,
    field: (row) => row.employee?.department?.name,
  },
  {
    name: 'branch',
    label: 'Sucursal',
    required: true,
    align: 'left',
    sortable: true,
    field: (row) => row.employee?.department?.branch?.name,
  },
  {
    name: 'comments',
    label: 'Comentarios',
    required: true,
    align: 'left',
    sortable: true,
    field: 'comments',
  },
]

const rows = ref()
const loading = ref(false)

async function getData(
  sku: string,
  fn: (...fnArgs: any) => Promise<AxiosCustomResponse>,
) {
  rows.value = []
  loading.value = true

  const { data, message, error } = await handleRequest(fn, sku)

  if (error) {
    message?.display()
    rows.value = []
  } else {
    rows.value = data
  }

  loading.value = false
}

defineExpose({ getData })
</script>

<template>
  <q-dialog v-model="model">
    <q-card class="col-12 q-px-sm">
      <q-card-section>
        <div class="text-h6">
          {{ `Historial de prestamos - ${props.title}` }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-table :rows="rows || []" :columns="columns" :loading="loading" />
      </q-card-section>

      <q-card-section align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
