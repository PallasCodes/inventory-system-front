import { api } from 'app/src/api'
import { SingleItemUpdateForm } from 'src/modules/inventory/components/DialogUpdateSingleItem.vue'

const BASE_URL = '/item/singleItem'

export const SingleItemService = {
  findOneById(sku: string) {
    return api.get(`${BASE_URL}/${sku}`)
  },
  delete(sku: string) {
    return api.delete(`${BASE_URL}/${sku}`)
  },
  update(payload: SingleItemUpdateForm) {
    return api.put(BASE_URL, payload)
  },
}
