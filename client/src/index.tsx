import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './styles/index.css'
import 'react-quill/dist/quill.snow.css'

import { Provider } from 'react-redux'
import store from './redux/store'
ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
)
