const Notification = ({ message, color }) => {
  if (message === null) return null

  return <div className={`notification ${color}`}>{message}</div>
}

export default Notification
