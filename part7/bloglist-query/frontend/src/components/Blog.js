import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, username }) => {
  const [expanded, setExpanded] = useState(false)
  const queryClient = useQueryClient()

  const updateBlogMutation = useMutation(blogService.update, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

  const removeBlogMutation = useMutation(blogService.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

  const toggleExpanded = () => setExpanded(!expanded)

  const blogStyle = {
    border: '1px solid',
    padding: 5,
  }

  const handleLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    updateBlogMutation.mutate(updatedBlog)
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlogMutation.mutate(blog.id.toString())
    }
  }

  if (expanded)
    return (
      <div className="blog" style={blogStyle}>
        <div>
          {blog.title} {blog.author}{' '}
          <button onClick={toggleExpanded}>hide</button>
        </div>
        <div className="url">{blog.url}</div>
        <div className="likes">
          likes {blog.likes}{' '}
          <button className="like-button" onClick={handleLike}>
            like
          </button>
        </div>
        <div>{blog.user.name}</div>
        {username === blog.user.username ? (
          <button onClick={handleRemove}>remove</button>
        ) : null}
      </div>
    )

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleExpanded}>view</button>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
}

export default Blog
