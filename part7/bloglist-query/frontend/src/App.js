import { useEffect, useRef, useContext } from 'react'
import { useQuery } from 'react-query'
import { useUser } from './UserContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import blogService from './services/blogs'

import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Users from './components/Users'
import Togglable from './components/Togglable'
import UserContext from './UserContext'

const Blogs = () => {
  const user = useUser()
  const blogFormRef = useRef()

  const blogQuery = useQuery('blogs', blogService.getAll)

  if (blogQuery.isLoading) {
    return <div>loading data...</div>
  }

  const blogs = blogQuery.data.sort((a, b) => (a.likes > b.likes ? -1 : 1))

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm
        toggleVisibility={() => blogFormRef.current.toggleVisibility()}
      />
    </Togglable>
  )

  return (
    <div>
      <div>{blogForm()}</div>
      <div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} username={user.username} />
        ))}
      </div>
    </div>
  )
}

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
        <Router>
          <Routes>
            <Route path="/" element={<Blogs />}></Route>
            <Route path="/users" element={<Users />} />
          </Routes>
        </Router>
      </div>
    </div>
  )
}

export default App
