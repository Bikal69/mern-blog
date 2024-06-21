import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import  {store,persistor} from './redux/store.js'
import { Provider } from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import './index.css'
import ThemeProvider from './components/ThemeProvider.jsx'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
      <QueryClientProvider client={queryClient}>
      <App />
      </QueryClientProvider>
      </ThemeProvider>
    </Provider>
    </PersistGate>
  </React.StrictMode>,
)
