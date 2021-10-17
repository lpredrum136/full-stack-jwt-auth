const JWTManager = () => {
  let inMemoryToken: string | null = null

  const getToken = () => inMemoryToken

  const setToken = (token: string) => {
    inMemoryToken = token
    return true
  }

  const deleteToken = () => {
    inMemoryToken = null
    return true
  }

  return { getToken, setToken, deleteToken }
}

export default JWTManager()
