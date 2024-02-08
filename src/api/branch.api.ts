import { api } from '.'

const BASE_URL = '/employee/branch'

export const BranchService = {
  findAll() {
    return api.get(`${BASE_URL}`)
  },
}
