import { api } from 'app/src/api'

const BASE_URL = '/item-catalog'

export const ItemCatalogsService = {
  getSingleItemStatuses() {
    return api.get(`${BASE_URL}/single-item-statuses`)
  },
}
