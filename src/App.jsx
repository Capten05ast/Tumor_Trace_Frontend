

import React from 'react'
import Navbar from './componenets/Navbar'
import MainRoutes from './routes/MainRoutes'

const App = () => {
  return (
    <div className='text-white font-thin w-screen min-h-screen bg-gray-900 p-3 scrollbar-hide'>
      <Navbar />
      <MainRoutes />
    </div>
  )
}

export default App




