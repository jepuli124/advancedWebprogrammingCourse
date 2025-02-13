//import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MyColumns from './components/MyColumns'
import MyLogin from './components/MyLogin'
import MyCardAdder from './components/MyCardAdder'
import MyColumnAdder from './components/MyColumnAdder'
import AdminView from './components/AdminView'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'




function App() {



  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element= {
            <MyLogin />
          }/>
          <Route path="/cards/" element= {
            //dndprovider is required for drag and drop to work
            <DndProvider backend={HTML5Backend}> <MyColumns /> </DndProvider> 
          }/>
          <Route path="/addCard/" element= {
            <MyCardAdder column={null}/>
          }/>
          <Route path="/addColumn/" element= {
            <MyColumnAdder />
          }/>
          <Route path="/adminView/" element= {
            <DndProvider backend={HTML5Backend}> <AdminView /> </DndProvider>
          }/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
