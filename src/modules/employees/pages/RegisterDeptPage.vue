<script setup lang="ts">
function registerDept() {
  console.log('first')
}
</script>

<template>
  <div class="row">
    <div class="col-12">
      <q-card style="max-width: 420px" class="q-px-xs">
        <q-card-section class="q-pb-none">
          <div class="text-subtitle1 text-weight-medium">Departamento</div>
        </q-card-section>
        <q-card-section class="q-pt-sm">
          <q-form @submit.prevent="registerDept">
            <div class="row q-gutter-y-sm">
              <div class="col-12">
                <q-input type="text" label="Nombre"></q-input>
              </div>
              <div class="col-12">
                <q-select label="Sucursal"></q-select>
              </div>
              <div class="col-12">
                <q-btn type="submit" color="primary" class="q-mt-md"
                  >Registrar Departamento</q-btn
                >
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
