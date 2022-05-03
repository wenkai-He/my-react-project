import React, { useState } from 'react'
import { Layout,Menu, Dropdown,Avatar } from 'antd';
import {UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';

const { Header } = Layout;  
export default function TopHeader() {
  const {role:{roleName},username}=JSON.parse(localStorage.getItem('token'))
  const navigate = useNavigate()
  const [collapsed, setcollapsed] = useState(false)
  const changeCollapsed = () => {
    setcollapsed(!collapsed)
  }
  const onClick = ({ key }) => {
    if(key==='tmp-1'){
      localStorage.removeItem('token')
      navigate('/login')
    }
  };
  const menu = (
    <Menu
    onClick={onClick}
      items={[
        {
          label: (<span>欢迎{roleName}回来</span>),
          key: 'mail',
        },
        {
          danger: true,
          label: '退出登录',
        },
      ]}
    />
  );
  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      {
        collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
      }
      <div style={{ float: 'right' }}>
        <span>{username}</span>
        <Dropdown overlay={menu}>
        <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
