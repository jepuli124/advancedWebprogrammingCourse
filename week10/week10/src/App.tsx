//import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MyContainer from './components/MyContainer'
import Header from './components/Header'
import About from './components/About'

import './i18n'

function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element= {
            <>
              <MyContainer/>

            </>} />
            <Route path="/about" element={<About />} />

        </Routes>
      </BrowserRouter>
    </>
  )
} //            <Route path="/use-effect-demo" element={<UseEffectDemo />} />

export default App
