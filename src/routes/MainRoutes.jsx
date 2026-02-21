

import React from 'react'
import Register from '../pages/Register'
import Login from '../pages/Login'
import Home from '../pages/Home'
import { Route, Routes } from "react-router-dom"
import { useSelector } from 'react-redux'
// import Upload from '../pages/Upload'
import UserProfile from '../pages/UserProfile'
import TumorDetection from '../pages/TumorDetection'
import TumorClassification from '../pages/TumorClassification'


const MainRoutes = () => {
    const user = useSelector((state) => state.userReducer.users);

    return (
        <Routes>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Home />} />
            {/* <Route path='/upload/:id' element={ user ? <Upload /> : <Login /> } /> */}
            <Route path="/detect/:id" element={ user ? <TumorDetection /> : <Login /> } />
            <Route path="/classify" element={ user ? <TumorClassification /> : <Login /> } />
            <Route path='/profile' element={<UserProfile />} />
        </Routes>
    )
}

export default MainRoutes