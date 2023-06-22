import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import CommentIcon from '@mui/icons-material/Comment'
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
      <Typography variant="h5">{blog.title}</Typography>
      <Typography>
        <a href={blog.url}>{blog.url}</a>
      </Typography>
      <Typography className="likes">
        likes {blog.likes}{' '}
        <Button
          className="like-button"
          size="small"
          variant="outlined"
          startIcon={<ThumbUpIcon />}
          onClick={handleLike}
        >
          like
        </Button>
      </Typography>
      <Typography>added by {blog.user.name}</Typography>
      <Typography>comments</Typography>
      <form onSubmit={addComment}>
        <div>
          <TextField
            id="comment"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
          />
        </div>
        <Button variant="outlined" type="submit">
          add comment
        </Button>
      </form>
      <List>
        {blog.comments.map((comment) => (
          <ListItem key={comment}>
            <ListItemIcon>
              <CommentIcon />
            </ListItemIcon>
            <ListItemText>{comment}</ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default BlogPage
