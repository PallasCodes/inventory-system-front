import { useQuery } from '@tanstack/vue-query'

import { api } from 'src/api'
import { Category } from '../interfaces/Category'

const getCategory = async (id: string): Promise<Category> => {
  const { data } = await api.get(`/item/category/${id}`)
  return data
}

const useCategory = (id: string) => {
  const categoryQuery = useQuery(['category', id], () => getCategory(id))

  return {
    categoryQuery,
  }
}

export default useCategory
