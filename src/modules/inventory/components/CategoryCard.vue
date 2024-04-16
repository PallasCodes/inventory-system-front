<script setup lang="ts">
import { handleRequest } from 'src/utils/handleRequest'
import { Category } from '../interfaces/Category'
import { CategoryService } from 'src/api/category.api'
import { Loading } from 'quasar'
import DeleteDialog from 'src/components/DeleteDialog.vue'
import { ref } from 'vue'

interface Props {
  category: Category
}

const props = defineProps<Props>()

const emit = defineEmits(['onDelete'])

const dialogDelete = ref<boolean>(false)

async function onDeleteCategory() {
  Loading.show()

  const { message, error } = await handleRequest(
    CategoryService.delete,
    props.category.idCategory,
  )

  Loading.hide()
  message?.display()

  if (!error) emit('onDelete', props.category.idCategory)
}
</script>

<template>
  <q-card flat bordered style="padding-bottom: 0px !important">
    <q-card-section style="padding: 4px 10px">
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-subtitle2">{{ props.category.name }}</div>
          <span class="text-caption">{{ props.category.description }}</span>
        </div>

        <div class="col-auto">
          <q-btn color="grey-7" round flat icon="more_vert">
            <q-menu cover auto-close>
              <q-list>
                <q-item clickable>
                  <q-item-section @click="dialogDelete = true">Eliminar</q-item-section>
                </q-item>
                <q-item
                  clickable
                  :to="{
                    name: 'update-category',
                    params: { idCategory: props.category.idCategory },
                  }"
                >
                  <q-item-section>Editar</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </q-card-section>

    <router-link
      :to="`/categories/${props.category.idCategory}`"
      class="block"
      style="height: auto !important"
      round
    >
      <img
        :src="category.imgUrl ? category.imgUrl : 'noImg.png'"
        style="
          width: 100%;
          height: auto;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          display: block;
        "
      />
    </router-link>
  </q-card>

  <DeleteDialog
    title="¿Desea eliminar la categoría?"
    v-model="dialogDelete"
    @delete="onDeleteCategory"
  />
</template>
