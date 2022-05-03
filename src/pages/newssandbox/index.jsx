import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Layout } from 'antd';
import SideMenu from '@/components/newssandbox/SideMenu'
import TopHeader from '@/components/newssandbox/TopHeader'
import Home from './Home'
import UserList from './UserList'
import RoleList from './RoleList'
import RightList from './RightList'
import NotFound from './NotFound'
import './index.css'
const { Content } = Layout;
export default function NewsSandBox() {
  return (
    <Layout>
      <SideMenu />
      <Layout className="site-layout">
        <TopHeader />

        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow:'auto'
          }}
        >
          <Routes>
            <Route path='/home' element={<Home />} />
            <Route path='/' element={<Navigate to="/home" />} />
            <Route path='/user-manage/list' element={<UserList />} />
            <Route path='/right-manage/role/list' element={<RoleList />} />
            <Route path='/right-manage/right/list' element={<RightList />} />
            <Route path='*' element={<NotFound />}></Route>
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}
