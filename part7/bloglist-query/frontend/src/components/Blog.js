import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { Paper, Button, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
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
    marginBottom: 5,
    marginTop: 5,
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
      <Paper className="blog" style={blogStyle}>
        <Typography>
          {blog.title} {blog.author}{' '}
          <Button size="small" variant="contained" onClick={toggleExpanded}>
            hide
          </Button>
        </Typography>
        <Typography className="url">{blog.url}</Typography>
        <Typography className="likes">
          likes {blog.likes}{' '}
          <Button
            size="small"
            variant="outlined"
            startIcon={<ThumbUpIcon />}
            className="like-button"
            onClick={handleLike}
          >
            like
          </Button>
        </Typography>
        <Typography>{blog.user.name}</Typography>
        {username === blog.user.username ? (
          <Button
            size="small"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={handleRemove}
          >
            remove
          </Button>
        ) : null}
      </Paper>
    )

  return (
    <Paper style={blogStyle}>
      <Link to={`/blogs/${blog.id}`} key={blog.id}>
        <Typography>{blog.title}</Typography>
      </Link>
      <Typography>{blog.author} </Typography>
      <Button variant="outlined" size="small" onClick={toggleExpanded}>
        expand
      </Button>
    </Paper>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
}

export default Blog
