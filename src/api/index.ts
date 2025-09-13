import { isAxiosError } from 'axios'
import instance from './axiosInstance'

export const getUser = async () => {
  try {
    const response = await instance.get('/users')
    return response.data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error(error.message)

      console.error('status', error.response.status)
      console.error('status', error.response.data)
    } else {
      console.error('Unknown Error', error)
    }
  }
}
