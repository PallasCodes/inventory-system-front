import { api } from '.'

const BASE_URL = '/borrowing'

export const BorrowingsService = {
  findAll() {
    return api.get(BASE_URL)
  },
}
