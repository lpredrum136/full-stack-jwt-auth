import { useUsersQuery } from '../generated/graphql'

const Home = () => {
  const { data, loading } = useUsersQuery({ fetchPolicy: 'no-cache' })

  if (loading) {
    return <div>Loading</div>
  }

  return (
    <ul>
      {data?.users.map(user => (
        <li key={user.id}>{user.username}</li>
      ))}
    </ul>
  )
}

export default Home
