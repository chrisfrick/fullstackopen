import { useState } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import { useNotificationDispatch } from '../NotificationContext'
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
      <h2>create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title:
            <input
              id="title"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              placeholder="title"
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              id="author"
              value={newAuthor}
              onChange={(event) => setNewAuthor(event.target.value)}
              placeholder="author"
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              id="url"
              value={newUrl}
              onChange={(event) => setNewUrl(event.target.value)}
              placeholder="url"
            />
          </label>
        </div>
        <button id="blog-submit-button" type="submit">
          create
        </button>
      </form>
    </div>
  )
}

export default BlogForm
