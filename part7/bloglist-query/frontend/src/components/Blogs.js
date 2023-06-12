import { useRef } from 'react'
import { useQuery } from 'react-query'
import { useUser } from '../UserContext'

import blogService from '../services/blogs'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'

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

export default Blogs
