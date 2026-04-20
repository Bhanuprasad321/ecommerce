// Step 1 — import axios
import axios from 'axios'

// Step 2 — create instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api'
})

// Step 3 — add interceptor
api.interceptors.request.use((config) => {

  // get token from localStorage
  const token = localStorage.getItem('token')

  // if token exists attach it to header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // always return config
  return config
})

// Step 4 — export
export default api