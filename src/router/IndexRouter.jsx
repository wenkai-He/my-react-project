import React from 'react'
import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom'
import Login from '@/pages/Login'
import NewsSandBox from '@/pages/newssandbox'
import News from '@/pages/news'
import Detail from '@/pages/detail'
export default function IndexRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/news' element={<News />} />
        <Route path='/detail/:id' element={<Detail />} />
        <Route path='/*' element={localStorage.getItem('token')?<NewsSandBox />:<Navigate to="login"/>} />
      </Routes>
    </BrowserRouter>
  )
}
