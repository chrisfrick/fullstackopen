import { useNotification } from '../NotificationContext'

const Notification = () => {
  const notification = useNotification()

  if (notification.message === null) return null

  return (
    <div className={`notification ${notification.type}`}>
      {notification.message}
    </div>
  )
}

export default Notification
