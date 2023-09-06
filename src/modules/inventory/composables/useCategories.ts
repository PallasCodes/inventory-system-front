import { api } from 'src/api'
import { Category } from '../interfaces/Category'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'

const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<Category[]>('/item/category')
  return data
}

const useCategories = () => {
  const categoriesQuery = useQuery(['categories'], () => getCategories())

  const queryClient = useQueryClient()

  const activeSearch = ref<boolean>(false)
  const searchResult = ref()

  const filterData = () => {
    console.log('filtering')
    activeSearch.value = true
    searchResult.value = queryClient.getQueryData<Category[]>(['categories'])
    searchResult.value = searchResult.value.filter(
      (category: Category) => category.name === 'Laptops',
    )
  }

  return {
    categoriesQuery,
    data: activeSearch.value ? searchResult : categoriesQuery.data,
    filterData,
  }
}

export default useCategories
