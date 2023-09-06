import { reactive } from 'vue'

export interface SingleItem {
  state: string
  comments?: string
}

const store = reactive<SingleItem[]>([{ state: 'available', comments: '' }])

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
      (singleItem, i) => {
        return {
          state: 'available',
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
