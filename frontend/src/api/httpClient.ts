import axios from 'axios'
import { API_BASE_URL, AUTH_TOKEN_STORAGE_KEY } from '../constants/config.constants'

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default httpClient
