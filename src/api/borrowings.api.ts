import { Borrowing } from 'src/modules/borrowings/interfaces/Borrowing'
import { api } from '.'
import { RegisterReturnForm } from 'src/modules/borrowings/pages/RegisterReturnPage.vue'

const BASE_URL = '/borrowing'

export const BorrowingsService = {
  findAll() {
    return api.get(BASE_URL)
  },
  register(payload: Borrowing) {
    return api.post(BASE_URL, payload)
  },
  listDueBorrowings() {
    return api.get(`${BASE_URL}/due-borrowings`)
  },
  registerReturn(payload: RegisterReturnForm) {
    return api.post(`${BASE_URL}/register-return`, payload)
  },
  getBorrowingsHistory(sku: string) {
    return api.get(`${BASE_URL}/borrowings-history/${sku}`)
  },
  cancelBorrowing(idBorrowing: string) {
    return api.post(`${BASE_URL}/cancel/${idBorrowing}`)
  },
}
