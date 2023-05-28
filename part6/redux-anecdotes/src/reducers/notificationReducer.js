import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notificaion',
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    removeNotification(state) {
      return null
    }
  }
})

export const { setNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer
