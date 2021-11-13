import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState
} from 'react'
import JWTManager from '../utils/jwt'

interface AuthContextDefault {
  isAuthenticated: boolean
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const AuthContext = createContext<AuthContextDefault>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  logout: () => {},
  checkAuth: () => Promise.resolve()
})

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const checkAuth = async () => {
    const token = JWTManager.getToken()
    if (!token) {
      const success = await JWTManager.getRefreshToken()
      if (success) setIsAuthenticated(true)
    }
  }

  const logout = () => {
    JWTManager.deleteToken()
    setIsAuthenticated(false)
  }

  const authContextData = {
    isAuthenticated,
    setIsAuthenticated,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
