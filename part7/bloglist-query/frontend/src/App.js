import { useEffect, useContext } from 'react'
import { Routes, Route, Link } from 'react-router-dom'

import blogService from './services/blogs'

import {
  Container,
  AppBar,
  Toolbar,
  Button,
  List,
  Typography,
} from '@mui/material'

import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Blogs from './components/Blogs'
import Users from './components/Users'
import User from './components/User'
import UserContext from './UserContext'
import BlogPage from './components/BlogPage'

const App = () => {
  const [user, userDispatch] = useContext(UserContext)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET', payload: user })
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    userDispatch({ type: 'SET', payload: null })
  }

  if (user === null) {
    return (
      <Container>
        <h2>Log in</h2>
        <Notification />
        <LoginForm />
      </Container>
    )
  }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <List sx={{ flexGrow: 1 }}>
            <Button color="inherit" component={Link} to="/">
              blogs
            </Button>
            <Button color="inherit" component={Link} to="/users">
              users
            </Button>
          </List>
          <Typography component="div" sx={{ paddingRight: 1 }}>
            {user.name} logged in
          </Typography>
          <Button variant="outlined" color="inherit" onClick={handleLogout}>
            logout
          </Button>
        </Toolbar>
      </AppBar>
      <Typography variant="h4">blogs</Typography>
      <Notification />
      <div>
        <Routes>
          <Route path="/" element={<Blogs />}></Route>
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />}></Route>
          <Route path="/blogs/:id" element={<BlogPage />}></Route>
        </Routes>
      </div>
    </Container>
  )
}

export default App
