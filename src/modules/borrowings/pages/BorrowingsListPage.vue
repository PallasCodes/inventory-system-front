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
  returned: boolean
}

const borrowings = ref<ItemTable[]>([])
const tableData = ref<ItemTable[]>([])

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
    name: 'returned',
    label: 'Devuelto',
    align: 'left',
    field: 'returned',
    required: true,
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

const showDueOnly = ref(false)

onMounted(async () => {
  const { data, message, error } = await handleRequest(BorrowingsService.findAll)

  if (!error) {
    tableData.value = data
    borrowings.value = data
  }
})

function onToggle(val: boolean) {
  if (val) {
    tableData.value = borrowings.value.filter((i) => i.returned)
  } else {
    tableData.value = borrowings.value
  }
}
</script>

<template>
  <div class="row">
    <div class="col">
      <q-toggle
        v-model="showDueOnly"
        label="Mostrar solo pendientes"
        left-label
        @update:model-value="onToggle"
      />
      <q-table
        title="Préstamos"
        :rows="tableData"
        :columns="columns"
        :pagination="{ rowsPerPage: 20 }"
        row-key="idBorrowing"
      >
        <template #body-cell-returned="{ value }">
          <q-td>
            <q-icon
              :name="value ? 'check' : 'close'"
              :color="value ? 'green' : 'red'"
              size="sm"
              class="q-mx-auto"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>
