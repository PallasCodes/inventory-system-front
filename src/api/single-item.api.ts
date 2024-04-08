import { api } from 'app/src/api'

const BASE_URL = '/item/singleItem'

export const SingleItemService = {
  findOneById(sku: string) {
    return api.get(`${BASE_URL}/${sku}`)
  },
  delete(sku: string) {
    return api.delete(`${BASE_URL}/${sku}`)
  },
}
