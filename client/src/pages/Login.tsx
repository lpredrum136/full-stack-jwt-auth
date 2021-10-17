import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useLoginMutation } from '../generated/graphql'
import JWTManager from '../utils/jwt'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const history = useHistory()
  const [login, _] = useLoginMutation()

  const onSubmit = async () => {
    const response = await login({
      variables: { loginInput: { username, password } }
    })
    if (response.data?.login.success) {
      JWTManager.setToken(response.data.login.accessToken as string)
    }
    console.log('TOKEN FROM LOGIN', JWTManager.getToken())
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
