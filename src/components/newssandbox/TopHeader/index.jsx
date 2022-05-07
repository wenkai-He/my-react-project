import React from 'react'
import { Layout,Menu, Dropdown,Avatar } from 'antd';
import {UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';

const { Header } = Layout;  
function TopHeader(props) {
  
  const {role:{roleName},username}=JSON.parse(localStorage.getItem('token'))

  const navigate = useNavigate()

  const changeCollapsed = () => {
    props.changeCollapsed()
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
          label: (<span>欢迎<span style={{color:"#1890ff"}}>{roleName}</span>回来</span>),
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
        props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
      }
      <div style={{ float: 'right' }}>
        <span><span style={{color:"#1890ff"}}>{username}</span></span>
        <Dropdown overlay={menu}>
        <Avatar size="large" icon={<UserOutlined />} src="https://joeschmoe.io/api/v1/random"/>
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateProps=({CollapsedReducer:{isCollapsed}})=>{
  return {
    isCollapsed
  }
}

const mapDispatchToProps={
  changeCollapsed(){
    return {
      type:'change_collapsed',
    }
  }
}


export default connect(mapStateProps,mapDispatchToProps)(TopHeader)