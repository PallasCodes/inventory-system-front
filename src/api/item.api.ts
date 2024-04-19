import { api } from 'app/src/api'
import { UpdateItemFormData } from 'src/modules/inventory/components/DialogUpdateItem.vue'

const BASE_URL = '/item'

export const ItemService = {
  findAll() {
    return api.get(BASE_URL)
  },
  create(payload: object) {
    return api.post(BASE_URL, payload)
  },
  findOneById(idItem: string) {
    return api.get(`${BASE_URL}/${idItem}`)
  },
  findByCategory(categoryId: string) {
    return api.get(`${BASE_URL}/category/${categoryId}/items`)
  },
  getItemsCount() {
    return api.get(`${BASE_URL}/counts`)
  },
  generateSkuPrefix(skuPrefix: string) {
    return api.post(`${BASE_URL}/generateSkuPrefix`, { skuPrefix })
  },
  delete(idItem: string) {
    return api.delete(`${BASE_URL}/${idItem}`)
  },
  update(payload: UpdateItemFormData) {
    return api.put(BASE_URL, payload)
  },
}
