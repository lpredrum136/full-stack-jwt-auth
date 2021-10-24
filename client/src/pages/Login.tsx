import { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { useLoginMutation } from '../generated/graphql'
import JWTManager from '../utils/jwt'

const Login = () => {
  // Hooks
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()
  const [login, _] = useLoginMutation()
  const { setIsAuthenticated } = useContext(AuthContext)

  const onSubmit = async () => {
    const response = await login({
      variables: { loginInput: { username, password } }
    })
    if (response.data?.login.success) {
      JWTManager.setToken(response.data.login.accessToken as string)
      setIsAuthenticated(true)
    }
    history.push('/')
  }

  return (
    <form
      onSubmit={async event => {
        event.preventDefault()
        await onSubmit()
      }}
    >
      <input
        type="text"
        value={username}
        placeholder="Username"
        onChange={event => {
          setUsername(event.target.value)
        }}
      />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={event => {
          setPassword(event.target.value)
        }}
      />
      <button type="submit">Login</button>
    </form>
  )
}

export default Login
