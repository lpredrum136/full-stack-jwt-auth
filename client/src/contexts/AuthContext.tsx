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
}

export const AuthContext = createContext<AuthContextDefault>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  logout: () => {}
})

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const logout = () => {
    JWTManager.deleteToken()
    setIsAuthenticated(false)
  }

  const authContextData = {
    isAuthenticated,
    setIsAuthenticated,
    logout
  }

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
