import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import Goodbye from './pages/Goodbye'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

const App = () => (
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
    </header>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/goodbye" component={Goodbye} />
    </Switch>
  </BrowserRouter>
)

export default App
