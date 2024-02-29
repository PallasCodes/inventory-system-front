import { reactive } from 'vue'
import { uid } from 'quasar'

export interface SingleItem {
  tempId: string
  singleItemStatus: { idSingleItemStatus: number; name: string }
  comments?: string
  image?: File | null
  imgUrl?: string | null
}

const store = reactive<SingleItem[]>([
  {
    tempId: uid(),
    singleItemStatus: { idSingleItemStatus: 1, name: 'Disponible' },
    comments: '',
    image: null,
  },
])

const item = reactive({
  name: '',
})

function setItemName(name: string) {
  item.name = name
}

function updateStore(singleItemsAmount: number) {
  if (singleItemsAmount > store.length) {
    const newSingleItems = Array.from(
      { length: singleItemsAmount - store.length },
      () => {
        return {
          tempId: uid(),
          singleItemStatus: { idSingleItemStatus: 1, name: 'Disponible' },
          comments: '',
          image: null,
        }
      },
    )
    store.push(...newSingleItems)
  } else if (singleItemsAmount < store.length) {
    store.splice(store.length - 1, store.length - singleItemsAmount)
  }
}

export default { store, updateStore, setItemName }
