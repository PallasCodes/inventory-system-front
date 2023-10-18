import { reactive } from 'vue'

export interface SingleItem {
  singleItemStatus: { idSingleItemStatus: number; name: string }
  comments?: string
}

const store = reactive<SingleItem[]>([
  { singleItemStatus: { idSingleItemStatus: 1, name: 'Disponible' }, comments: '' },
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
          singleItemStatus: { idSingleItemStatus: 1, name: 'Disponible' },
          comments: '',
        }
      },
    )
    store.push(...newSingleItems)
  } else if (singleItemsAmount < store.length) {
    store.splice(store.length - 1, store.length - singleItemsAmount)
  }
}

export default { store, updateStore, setItemName }
