import axios, { AxiosError } from 'axios'
import jwtDecode, { JwtPayload } from 'jwt-decode'

const JWTManager = () => {
  const LOGOUT_EVENT_NAME = 'jwt-logout'
  let inMemoryToken: string | null = null
  let refreshTokenTimeoutId: number | null = null
  let userId: number | null = null

  const getUserId = () => userId

  const getToken = () => inMemoryToken

  const setToken = (accessToken: string) => {
    inMemoryToken = accessToken
    // Decode and set countdown to refresh
    const decoded = jwtDecode<JwtPayload & { userId: number }>(accessToken)
    userId = decoded.userId
    setRefreshTokenTimeout((decoded.exp as number) - (decoded.iat as number))

    return true
  }

  const deleteToken = () => {
    inMemoryToken = null
    abortRefreshToken()
    window.localStorage.setItem(LOGOUT_EVENT_NAME, Date.now().toString()) // to logout all tabs
    return true
  }

  // To logout all tabs
  window.addEventListener('storage', event => {
    if (event.key === LOGOUT_EVENT_NAME) inMemoryToken = null
  })

  // Auto refresh token
  const getRefreshToken = async () => {
    try {
      const response = await axios.get<{
        success: boolean
        accessToken: string
      }>('http://localhost:4000/refresh_token', {
        withCredentials: true
      })

      const accessToken = response.data.accessToken
      // console.log('ACCESS TOKEN', accessToken)
      setToken(accessToken)
      return true
    } catch (error) {
      if ((error as AxiosError).response?.status === 401) {
        deleteToken()
        console.log('NOT AUTHENTICATED', (error as AxiosError).response)
      }
      return false
    }
  }

  const setRefreshTokenTimeout = (delay: number) => {
    refreshTokenTimeoutId = window.setTimeout(
      getRefreshToken,
      delay * 1000 - 5000
    ) // 5s before token expires
  }

  const abortRefreshToken = () => {
    if (refreshTokenTimeoutId) window.clearTimeout(refreshTokenTimeoutId)
  }

  return { getToken, setToken, deleteToken, getRefreshToken, getUserId }
}

export default JWTManager()
