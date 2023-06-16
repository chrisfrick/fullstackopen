import { useMatch } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import blogService from '../services/blogs'
import { useState } from 'react'

const BlogPage = () => {
  const [newComment, setNewComment] = useState('')
  const match = useMatch('/blogs/:id')
  const id = match ? match.params.id : null

  const queryClient = useQueryClient()

  const updateBlogMutation = useMutation(blogService.update, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

  const commentMutation = useMutation(blogService.addComment, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

  const blogQuery = useQuery('blogs', blogService.getAll)
  if (blogQuery.isLoading) return <div>loading data...</div>
  const blog = blogQuery.data.find((b) => b.id === id)

  const handleLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    updateBlogMutation.mutate(updatedBlog)
  }

  const addComment = async (event) => {
    event.preventDefault()
    const commentObject = { comment: newComment, id: blog.id }
    setNewComment('')
    commentMutation.mutate(commentObject)
  }
  return (
    <div>
      <h2>{blog.title}</h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div className="likes">
        likes {blog.likes}{' '}
        <button className="like-button" onClick={handleLike}>
          like
        </button>
      </div>
      <div>added by {blog.user.name}</div>
      <h3>comments</h3>
      <form onSubmit={addComment}>
        <input
          id="comment"
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment) => (
          <li key={comment}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogPage
