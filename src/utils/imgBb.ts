import { externalApi } from 'src/api'

export async function makeAPICall(imgPayload: any): Promise<any> {
  const formData = new FormData()
  formData.append('image', imgPayload.image)
  formData.append('name', imgPayload.name)
  formData.append('key', '984cd4fb80b1dece88ef94d4ab376823')

  const response = await externalApi.post('https://api.imgbb.com/1/upload', formData)
  return response
}

// TODO: use env params
