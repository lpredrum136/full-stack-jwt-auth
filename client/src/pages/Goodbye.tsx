import { useGoodbyeQuery } from '../generated/graphql'

const Goodbye = () => {
  const { data, error, loading } = useGoodbyeQuery({ fetchPolicy: 'no-cache' })

  if (loading) return <p>Loading....</p>

  if (error) return <p>Error: {JSON.stringify(error)}</p>
  return <div>{data?.goodbye}</div>
}

export default Goodbye
