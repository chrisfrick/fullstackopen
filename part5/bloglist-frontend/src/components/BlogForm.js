import { useState } from "react"

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
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
            />
          </label> 
        </div>
        <div>
          <label>author:
            <input 
              value={newAuthor}
              onChange={event => setNewAuthor(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>url:
            <input 
              value={newUrl}
              onChange={event => setNewUrl(event.target.value)}
            />
          </label>
        </div>
        <button type="submit">create</button>
    </form>
    </div>
  )
}

export default BlogForm
