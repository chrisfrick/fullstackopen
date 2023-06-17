import { useState } from 'react'
import { useNotificationDispatch } from '../NotificationContext'
import { useUserDispatch } from '../UserContext'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { Button, TextField } from '@mui/material'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const userDispatch = useUserDispatch()
  const notificationDispatch = useNotificationDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      console.log(loginService)
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      userDispatch({ type: 'SET', payload: user })
      notificationDispatch({
        type: 'SET',
        payload: {
          message: `welcome ${username}`,
          type: 'success',
        },
      })
      setTimeout(() => notificationDispatch({ type: 'CLEAR' }), 5000)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notificationDispatch({
        type: 'SET',
        payload: {
          message: 'incorrect username or password',
          type: 'error',
        },
      })
      setTimeout(() => notificationDispatch({ type: 'CLEAR' }), 5000)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <TextField
          label="username"
          type="text"
          id="username"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <TextField
          label="password"
          type="password"
          id="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Button variant="contained" id="login-button" type="submit">
        login
      </Button>
    </form>
  )
}

export default LoginForm
