// import axios, { AxiosError } from 'axios'
import { useState, useEffect, useContext } from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { AuthContext } from './contexts/AuthContext'
// import Toast from './components/Toast'
import Goodbye from './pages/Goodbye'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import JWTManager from './utils/jwt'

const App = () => {
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, setIsAuthenticated, logout } =
    useContext(AuthContext)

  useEffect(() => {
    const authenticate = async () => {
      // try {
      //   const token = JWTManager.getToken()

      //   if (!token) {
      //     const response = await axios.get<{
      //       success: boolean
      //       accessToken: string
      //     }>('http://localhost:4000/refresh_token', {
      //       withCredentials: true
      //     })

      //     JWTManager.setToken(response.data.accessToken)
      //   }
      //   setIsAuthenticated(true)
      // } catch (error) {
      //   if ((error as AxiosError).response?.status === 401) {
      //     console.log('NOT AUTHENTICATED', (error as AxiosError).response)
      //   }
      // } finally {
      //   setLoading(false)
      // }

      const token = JWTManager.getToken()
      if (!token) {
        await JWTManager.getRefreshToken()
        if (!isAuthenticated) setIsAuthenticated(true)
        if (loading) setLoading(false)
      }
    }

    authenticate()
  }, [])

  if (loading) return <h1>Loading...</h1>
  return (
    <BrowserRouter>
      <header>
        <div>
          <Link to="/">Home</Link>
        </div>
        <div>
          <Link to="/register">Register</Link>
        </div>
        <div>
          <Link to="/login">Login</Link>
        </div>
        <div>
          <Link to="/goodbye">Goodbye</Link>
        </div>
        {isAuthenticated && <button onClick={logout}>Logout</button>}
      </header>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/goodbye" component={Goodbye} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
