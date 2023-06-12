import { useEffect, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'

import blogService from './services/blogs'

import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Blogs from './components/Blogs'
import Users from './components/Users'
import User from './components/User'
import UserContext from './UserContext'

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
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        <div>
          {user.name} logged in
          <div>
            <button onClick={handleLogout}>logout</button>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Blogs />}></Route>
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
