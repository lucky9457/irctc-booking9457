import React, {useState} from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Bookings from './components/Bookings'
import ProtectedRoute from './components/ProtectedRoute'
import SignUp from './components/SignUp';
import './App.css'


function App(){

  return (
    <div className="app-container">
     
   
           <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<ProtectedRoute element={Home} />} />
            <Route path="/bookings" element={<ProtectedRoute element={Bookings} />} />
           </Routes>
       
   
  </div>
  )
  
}

export default App

