import { createSlice } from '@reduxjs/toolkit'

const initialState = 'notification initial state'

const notificationSlice = createSlice({
  name: 'notificaion',
  initialState,
  reducers: {
    changeNotificaion(state, action) {
      return action.payload
    }
  }
})

export const { changeNotificaion } = notificationSlice.actions
export default notificationSlice.reducer
