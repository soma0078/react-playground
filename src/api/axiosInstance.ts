import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
})

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    // request가 서버에 보내지기 전에 실행
    console.log('Request sent:', config)
    return config
  },
  (error) => {
    // 요청 오류 처리
    console.log('인터셉터 요청 오류!')
    return Promise.reject(error)
  }
)

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    // 응답 데이터를 가공하거나 처리
    console.log('Response received:', response)
    return response
  },
  (error) => {
    // 응답 오류 처리
    console.log('인터셉트 응답 오류 발생!')
    return Promise.reject(error)
  }
)

export default instance
