// import axios, { AxiosError } from 'axios'
import { useState, useEffect, useContext } from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { AuthContext } from './contexts/AuthContext'
import { useLogoutMutation } from './generated/graphql'
// import Toast from './components/Toast'
import Goodbye from './pages/Goodbye'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import JWTManager from './utils/jwt'

const App = () => {
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, checkAuth, logout } = useContext(AuthContext)
  const [requestLogout, _] = useLogoutMutation()

  useEffect(() => {
    const authenticate = async () => {
      await checkAuth()
      setLoading(false)
    }

    authenticate()
  }, [])

  const logoutBothSides = async () => {
    logout()

    await requestLogout({
      variables: { userId: JWTManager.getUserId()?.toString() as string }
    })
  }

  if (loading) return <h1>Loading...</h1>
  return (
    <BrowserRouter>
      <header>
        <div style={{ margin: '20px' }}>
          <Link to="/">Home</Link>
        </div>
        <div style={{ margin: '20px' }}>
          <Link to="/register">Register</Link>
        </div>
        <div style={{ margin: '20px' }}>
          <Link to="/login">Login</Link>
        </div>
        <div style={{ margin: '20px' }}>
          <Link to="/goodbye">Goodbye</Link>
        </div>
        {isAuthenticated && (
          <button onClick={logoutBothSides} style={{ margin: '20px' }}>
            Logout
          </button>
        )}
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
