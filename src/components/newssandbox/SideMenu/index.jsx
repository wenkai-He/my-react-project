import React from 'react'
import { Layout, Menu } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './index.css'
import { useNavigate,useLocation } from 'react-router-dom';

const { Sider } = Layout;

export default function SideMenu() {
  const navigate = useNavigate()
  const location=useLocation()
  const selectKey=[location.pathname]
  const openKey=['/'+location.pathname.split('/')[1]]
  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }

  const items = [
    getItem('首页', '/home', <PieChartOutlined />),
    getItem('用户管理', '/user-manage', <DesktopOutlined />, [getItem('用户列表', '/user-manage/list', <UserOutlined />)]),
    getItem('权限管理', '/right-manage', <FileOutlined />, [
      getItem('角色列表', '/right-manage/role/list', <TeamOutlined />),
      getItem('权限列表', '/right-manage/right/list', <TeamOutlined />),
    ]),
    getItem('新闻管理', '/news-manage', <FileOutlined />, [
      getItem('撰写新闻', '/news-manage/add', <TeamOutlined />),
      getItem('草稿箱', '/news-manage/draft', <TeamOutlined />),
      getItem('新闻分类', '/news-manage/category', <TeamOutlined />),
    ]),
    getItem('审核管理', '/audit-manage', <FileOutlined />, [
      getItem('审核新闻', '/audit-manage/audit', <TeamOutlined />),
      getItem('审核列表', '/audit-manage/list', <TeamOutlined />),
    ]),
    getItem('发布管理', '/publish-manage', <FileOutlined />, [
      getItem('待发布', '/publish-manage/unpublished', <TeamOutlined />),
      getItem('已发布', '/publish-manage/published', <TeamOutlined />),
      getItem('已下线', '/publish-manage/sunset', <TeamOutlined />),
    ]),
  ];

  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div style={{display:"flex",height:"100%","flexDirection":"column"}}>
        <div className="logo">新闻发布管理系统</div>
        <div style={{flex:1,"overflow":'auto'}}>
        <Menu theme="dark" selectedKeys={selectKey} defaultOpenKeys={openKey} mode="inline" items={items} onClick={(item) => {
          navigate(item.key)
        }} />
        </div>
      </div>
    </Sider>
  )
}
