import { useQuery } from 'react-query'
import userService from '../services/users'
import { Link } from 'react-router-dom'
import {
  Paper,
  Table,
  TableContainer,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Typography,
} from '@mui/material'

const Users = () => {
  const result = useQuery('users', userService.getAll)

  if (result.isLoading) return <div>loading data...</div>

  const users = result.data

  return (
    <div>
      <Typography variant="h5">Users</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users
