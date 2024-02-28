<script setup lang="ts">
import { QTableProps } from 'quasar'
import { onMounted, ref } from 'vue'

import { handleRequest } from 'src/utils/handleRequest'
import { BorrowingsService } from 'src/api/borrowings.api'
import { formatters } from 'src/utils/formatters'

interface ItemTable {
  idEmployee: string
  fullName: string
  branch: string
}

const borrowings = ref<ItemTable[]>([])

const columns: QTableProps['columns'] = [
  {
    name: 'singleItem',
    label: 'Item',
    required: false,
    align: 'left',
    sortable: true,
    field: (row) => row.singleItem?.item?.name,
  },
  {
    name: 'employee',
    label: 'Empleado',
    required: false,
    align: 'left',
    sortable: true,
    field: (row) => row.employee?.fullName,
  },
  {
    name: 'borrowingDate',
    label: 'Fecha de préstamo',
    required: false,
    align: 'left',
    sortable: true,
    field: (row) => formatters.isoToRegularDate(row.borrowingDate),
  },
  {
    name: 'borrowingDeadline',
    label: 'Fecha acordada de devolución',
    align: 'left',
    field: (row) => formatters.isoToRegularDate(row.borrowingDeadline),
    required: false,
    sortable: true,
  },
  {
    name: 'returnDate',
    label: 'Fecha de devolución',
    align: 'left',
    field: (row) => formatters.isoToRegularDate(row.returnDate),
    required: false,
    sortable: true,
  },
  {
    name: 'comments',
    label: 'Comentarios',
    align: 'left',
    field: 'comments',
    required: false,
    sortable: true,
  },
]

onMounted(async () => {
  const { data, message, error } = await handleRequest(BorrowingsService.findAll)

  if (!error) borrowings.value = data
})
</script>

<template>
  <div class="row">
    <div class="col">
      <q-table
        title="Préstamos"
        :rows="borrowings"
        :columns="columns"
        :pagination="{ rowsPerPage: 20 }"
        row-key="idBorrowing"
      ></q-table>
    </div>
  </div>
</template>
