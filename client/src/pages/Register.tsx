import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useRegisterMutation } from '../generated/graphql'

const Register = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const history = useHistory()
  const [register, _] = useRegisterMutation()

  const onSubmit = async () => {
    await register({ variables: { registerInput: { username, password } } })
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
      <button type="submit">Register</button>
    </form>
  )
}

export default Register
