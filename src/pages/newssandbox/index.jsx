import React from 'react'
import { Layout } from 'antd';
import SideMenu from '@/components/newssandbox/SideMenu'
import TopHeader from '@/components/newssandbox/TopHeader'
import NewsRouter from '@/components/newssandbox/NewsRouter'
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
            overflow: 'auto'
          }}
        >
          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  )
}
