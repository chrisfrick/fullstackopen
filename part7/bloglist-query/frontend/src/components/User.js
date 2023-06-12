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
      <h2>{user.name}</h2>
      <h3>added the following blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.url}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
