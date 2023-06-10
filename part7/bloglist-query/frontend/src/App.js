import { useEffect, useRef, useContext } from 'react'
import { useQuery } from 'react-query'

import blogService from './services/blogs'

import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import UserContext from './UserContext'

const App = () => {
  const [user, userDispatch] = useContext(UserContext)
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET', payload: user })
      blogService.setToken(user.token)
    }
  }, [])

  const blogQuery = useQuery('blogs', blogService.getAll)

  if (blogQuery.isLoading) {
    return <div>loading data...</div>
  }

  const blogs = blogQuery.data.sort((a, b) => (a.likes > b.likes ? -1 : 1))

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    userDispatch({ type: 'SET', payload: null })
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm
        toggleVisibility={() => blogFormRef.current.toggleVisibility()}
      />
    </Togglable>
  )

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
          <button onClick={handleLogout}>logout</button>
        </div>
        <div>{blogForm()}</div>
        <div>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} username={user.username} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
