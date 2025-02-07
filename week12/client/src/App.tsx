//import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Book from './components/book'
import BookForm from './components/bookForm'

function App() {

  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element= {
            <BookForm />
          }/>
          <Route path="/book/:book" element= {
            <Book />
          }/>
        </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App
