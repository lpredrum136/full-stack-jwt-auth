import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useLoginMutation } from '../generated/graphql'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const history = useHistory()
  const [login, _] = useLoginMutation()

  const onSubmit = async () => {
    await login({ variables: { loginInput: { username, password } } })
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
