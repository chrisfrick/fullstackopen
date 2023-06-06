import { createSlice } from '@reduxjs/toolkit'

const initialState = { message: null, type: null }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationState(state, action) {
      return action.payload
    },
    removeNotification() {
      return { message: null, type: null }
    },
  },
})

export const setNotification = (notification, seconds = 5) => {
  return (dispatch) => {
    dispatch(setNotificationState(notification))
    setTimeout(() => dispatch(removeNotification()), seconds * 1000)
  }
}

export const { setNotificationState, removeNotification } =
  notificationSlice.actions
export default notificationSlice.reducer
