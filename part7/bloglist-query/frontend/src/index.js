import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { NotificationContextProvider } from './NotificationContext'
import store from './store'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <NotificationContextProvider>
      <App />
    </NotificationContextProvider>
  </Provider>
)
