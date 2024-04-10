import { api } from 'app/src/api'
import { Category } from 'src/modules/inventory/interfaces/Category'

const BASE_URL = '/item/category'

export const CategoryService = {
  findAll() {
    return api.get(BASE_URL)
  },
  create(payload: Category) {
    return api.post(BASE_URL, payload)
  },
  findOneById(id: string) {
    return api.get(`${BASE_URL}/${id}`)
  },
  delete(id: string) {
    return api.delete(`${BASE_URL}/${id}`)
  },
  update(payload: Category) {
    return api.put(BASE_URL, payload)
  },
}
