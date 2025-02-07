//import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import './App.css'
import SavedPage from './components/SavedPage'
import FrontPage from './components/FrontPage'

import { useJokes } from './hooks/useJokes';

function App() {
  //const [count, setCount] = useState(0)
  const {savedJokes, saveJoke, deleteJoke} = useJokes()
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element= {
              <FrontPage saveJoke={saveJoke} />
              } 
            />
          
            <Route path="/saved" element= {
              <SavedPage deleteJoke={deleteJoke} savedJokes={savedJokes}/>} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
