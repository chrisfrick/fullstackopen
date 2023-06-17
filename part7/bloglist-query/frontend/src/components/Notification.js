import { Alert } from '@mui/material'
import { useNotification } from '../NotificationContext'

const Notification = () => {
  const notification = useNotification()

  if (notification.message === null) return null

  return <Alert severity={notification.type}>{notification.message}</Alert>
}

export default Notification
