import React, { useState, useEffect } from 'react'
import { Button, Table, Modal,notification } from 'antd'
import { DeleteOutlined, UploadOutlined,EditOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios'
const { confirm } = Modal
export default function Draft() {
  const navigate = useNavigate()
  const {username} = JSON.parse(localStorage.getItem('token'))
  const showConfirm=(item)=> {
    console.log(item.id);
    confirm({
      title: '您确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
      },
    });
  }

  const deleteMethod = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/news/${item.id}`)
  }

  const handleCheck=(id)=>{
    axios.patch(`/news/${id}`,{
      auditState:1
    }).then(res => {
      navigate('/audit-manage/list')

      notification.info({
        message: `通知`,
        description:
          `您可以到审核列表中查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }

  const [dataSource, setdataSource] = useState([])
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      setdataSource(res.data)
    })
  }, [username])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render:(title,item)=>{
        return <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
      
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (category) => category.title,
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button
            danger
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
          onClick={()=>showConfirm(item)}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={()=>{
              navigate(`/news-manage/update/${item.id}`)
            }}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<UploadOutlined />}
            onClick={()=>{
              handleCheck(item.id)
            }}
          />
        </div>
      }
    }
  ];
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} pagination={{pageSize:5}}/>;
    </div>
  )
}
