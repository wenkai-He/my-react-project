import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import {
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './index.css'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
const { Sider } = Layout;

export default function SideMenu() {
  
  useEffect(() => {
    const {role:{rights}}=JSON.parse(localStorage.getItem('token'))
    
    axios.get('http://localhost:5000/rights?_embed=children').then(res => {
      res.data=res.data.filter(item=>item.pagepermisson===1)
      res.data=res.data.filter(item=>rights.includes(item.key))

      res.data.forEach(item => {
        if (item.children.length === 0) {
          item.children = ''
        } else {
          item.children=item.children.filter(item=>item.pagepermisson===1)
          item.children=item.children.filter(item=>rights.includes(item.key))
          item.children.forEach(element => {
            element.label = element.title;
            element.icon = <UserOutlined />
            delete element.title
            delete element.rightId
          })
        }
        item.icon = <PieChartOutlined />
        item.label = item.title;
        delete item.title
      })
      setitemList(res.data)
      
    })
  }, [])
  const [itemList, setitemList] = useState([
    {
      key: '/home',
      icon: <PieChartOutlined />,
      label: "首页"
    },
    {
      key: '/user-manage',
      icon: <PieChartOutlined />,
      label: "用户管理",
      children: [
        {
          key: '/user-manage/list',
          icon: <UserOutlined />,
          label: '用户列表'
        }
      ]
    }
  ])
  const navigate = useNavigate()
  const location = useLocation()
  const selectKey = [location.pathname]
  const openKey = ['/' + location.pathname.split('/')[1]]

  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
        <div className="logo">新闻发布管理系统</div>
        <div style={{ flex: 1, "overflow": 'auto' }}>
          <Menu theme="dark" selectedKeys={selectKey} defaultOpenKeys={openKey} mode="inline" items={itemList} onClick={(item) => {
            navigate(item.key)
          }} />
        </div>
      </div>
    </Sider>
  )
}
