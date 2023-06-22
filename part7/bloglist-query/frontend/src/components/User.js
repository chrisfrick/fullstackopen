import { List, ListItem, ListItemText, Typography } from '@mui/material'
import { useQuery } from 'react-query'
import { useMatch } from 'react-router-dom'
import userService from '../services/users'

const User = () => {
  const match = useMatch('/users/:id')
  const id = match ? match.params.id : null

  const result = useQuery('users', userService.getAll)
  if (result.isLoading) return <div>loading data...</div>
  const users = result.data

  const user = users.find((u) => u.id === id)

  return (
    <div>
      <Typography variant="h5">{user.name}</Typography>
      <Typography variant="h5">added the following blogs</Typography>
      <List>
        {user.blogs.map((blog) => (
          <ListItem key={blog.url}>
            <ListItemText primary={blog.title}></ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default User
