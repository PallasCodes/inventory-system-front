import { api } from 'app/src/api'

const BASE_URL = '/item'

export const ItemService = {
  findAll() {
    return api.get(`${BASE_URL}`)
  },
  create(body: object) {
    return api.post(BASE_URL, body)
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
}
