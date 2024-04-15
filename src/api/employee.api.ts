import { api } from 'app/src/api'
import { Employee } from 'src/modules/employees/interfaces/employee.interface'

const BASE_URL = '/employee'

export const EmployeeService = {
  create(body: Employee) {
    return api.post(BASE_URL, body)
  },
  findAll() {
    return api.get(BASE_URL)
  },
  delete(idEmployee: string) {
    return api.delete(`${BASE_URL}/${idEmployee}`)
  },
  findOne(idEmployee: string) {
    return api.get(`${BASE_URL}/${idEmployee}`)
  },
  update(payload: Employee) {
    return api.put(BASE_URL, payload)
  },
}
