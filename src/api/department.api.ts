import { api } from 'app/src/api'
import { Department } from 'src/modules/employees/interfaces/department.interface'

const BASE_URL = '/employee/department'

export const DepartmentService = {
  create(body: Department) {
    return api.post(`${BASE_URL}`, body)
  },
  findAllById(idBranch: string) {
    return api.get(`${BASE_URL}/${idBranch}`)
  },
}
