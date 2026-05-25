import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WishlistProvider } from './context/WishlistContext.jsx' // 1. Import the provider
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Wrap the App component inside the provider */}
    <WishlistProvider>
      <App />
    </WishlistProvider>
  </StrictMode>,
)


// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
// import './index.css'
// import App from './App.jsx'   // make sure App.jsx has `export default App`

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </StrictMode>,
// )





