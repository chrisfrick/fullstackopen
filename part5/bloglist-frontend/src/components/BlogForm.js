import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>title:
            <input
              id="title"
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              placeholder='title'
            />
          </label>
        </div>
        <div>
          <label>author:
            <input
              id="author"
              value={newAuthor}
              onChange={event => setNewAuthor(event.target.value)}
              placeholder='author'
            />
          </label>
        </div>
        <div>
          <label>url:
            <input
              id="url"
              value={newUrl}
              onChange={event => setNewUrl(event.target.value)}
              placeholder='url'
            />
          </label>
        </div>
        <button id="blog-submit-button" type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
