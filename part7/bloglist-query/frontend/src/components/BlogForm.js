import { useState } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import { useNotificationDispatch } from '../NotificationContext'
import { Typography, TextField, Button } from '@mui/material'
import blogService from '../services/blogs'

const BlogForm = ({ toggleVisibility }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
    toggleVisibility()
    newBlogMutation.mutate(blogObject)
    notificationDispatch({
      type: 'SET',
      payload: {
        message: `a new blog ${blogObject.title} successfully added`,
        type: 'success',
      },
    })
    setTimeout(() => notificationDispatch({ type: 'CLEAR' }), 5000)
  }

  return (
    <div>
      <Typography variant="h5">create a new blog</Typography>
      <form onSubmit={addBlog}>
        <div>
          <label>
            <TextField
              label="title"
              size="small"
              id="title"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              placeholder="title"
            />
          </label>
        </div>
        <div>
          <label>
            <TextField
              label="author"
              size="small"
              id="author"
              value={newAuthor}
              onChange={(event) => setNewAuthor(event.target.value)}
              placeholder="author"
            />
          </label>
        </div>
        <div>
          <label>
            <TextField
              label="url"
              size="small"
              id="url"
              value={newUrl}
              onChange={(event) => setNewUrl(event.target.value)}
              placeholder="url"
            />
          </label>
        </div>
        <Button variant="contained" id="blog-submit-button" type="submit">
          create
        </Button>
      </form>
    </div>
  )
}

export default BlogForm
