import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache
} from '@apollo/client'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import JWTManager from './utils/jwt'
import { setContext } from '@apollo/client/link/context'
import AuthContextProvider from './contexts/AuthContext'

// NORMALLY COOKIE IS SET IN THIS WAY, BUT NO AUTHENTICATED REQUEST IS SENT
// const client = new ApolloClient({
//   uri: 'http://localhost:4000/graphql',
//   cache: new InMemoryCache(),
//   credentials: 'include' // this only works when CORS backend is localhost:3000
//   // headers: {
//   //   Authorization: `Bearer ${JWTManager.getToken()}`
//   // },
// })

// THIS IS HOW AUTHENTICATED REQUEST IS MADE BY RETRIEVING TOKEN FROM JWT MANAGER

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include'
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = JWTManager.getToken()
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
  // credentials: 'include' // uncomment if you'd like but I don't see any difference, it works regardless
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <AuthContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </AuthContextProvider>
  </ApolloProvider>,

  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
