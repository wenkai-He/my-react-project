import React from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.css'
import axios from 'axios';
export default function Login() {
  const navigate = useNavigate()
  const onFinish = (values) => {
    axios.get(`http://localhost:5000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res=>{
      if(res.data.length===0){
        message.error('用户名或密码不匹配')
      }else{
        localStorage.setItem('token',JSON.stringify(res.data[0]))
        navigate('/home')
      }
    })
  };
  
  return (
    <div style={{ background: 'rgb(35,39,65)', height: "100%" }}>
      <div className='formContainer'>
        <div className='title'>全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
