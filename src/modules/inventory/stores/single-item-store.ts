import { reactive } from 'vue'
import { uid } from 'quasar'
import { SingleItemStatusEnum } from '../interfaces/SingleItemStatus.catalog'

export interface SingleItem {
  tempId: string
  singleItemStatus: { idSingleItemStatus: number; name: string }
  comments?: string
  image?: File | null
  imgUrl?: string | null
}

const item = reactive({
  name: '',
})

const store = reactive<SingleItem[]>([
  {
    tempId: uid(),
    singleItemStatus: SingleItemStatusEnum.AVAILABLE,
    comments: '',
    image: null,
  },
])

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
          singleItemStatus: SingleItemStatusEnum.AVAILABLE,
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
