import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationText(state, action) {
      return action.payload
    },
    removeNotification(state) {
      return null
    }
  }
})

export const { setNotificationText, removeNotification } = notificationSlice.actions

export const setNotification = (message, seconds = 5) => {
  return dispatch => {
    console.log(message, seconds)
    dispatch(setNotificationText(message))
    setTimeout(() => dispatch(removeNotification()), (seconds * 1000))
  }
}

export default notificationSlice.reducer
