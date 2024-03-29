import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, setBlogs } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'

import blogService from './services/blogs'
import loginService from './services/login'

import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(
        setNotification(
          {
            message: 'incorrect username or password',
            type: 'error',
          },
          5
        )
      )
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    dispatch(setUser(null))
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          id="username"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          id="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  )

  const handleLike = async (id) => {
    const blog = blogs.find((b) => b.id === id)
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    const returnedBlog = await blogService.update(id.toString(), updatedBlog)
    dispatch(
      setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)))
    )
  }

  const handleRemove = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(blog.id.toString())
      dispatch(setBlogs(blogs.filter((b) => b.id !== blog.id.toString())))
    }
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    let newBlog = await blogService.create(blogObject)
    dispatch(setBlogs(blogs.concat(newBlog)))

    dispatch(
      setNotification(
        {
          message: `a new blog ${newBlog.title} successfully added`,
          type: 'success',
        },
        5
      )
    )
  }

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        {loginForm()}
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
            <Blog
              key={blog.id}
              blog={blog}
              username={user.username}
              handleLike={() => handleLike(blog.id)}
              handleRemove={() => handleRemove(blog)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
