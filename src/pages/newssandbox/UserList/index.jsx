import React, { useState, useEffect, useRef } from 'react'
import { Modal, Button, Table, Switch } from 'antd'
import axios from 'axios'
import { ExclamationCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import UserForm from '@/components/user-manage/UserForm';
export default function UserList() {
  const { confirm } = Modal;

  const [dataSource, setdataSource] = useState([])
  const [visible, setVisible] = useState(false);
  const [regionList, setregionList] = useState([])
  const [roleList, setroleList] = useState([])
  const addForm = useRef(null)

  //删除回调
  function showConfirm(item) {
    confirm({
      title: '您确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
      },
    });
  }

  const deleteMethod = (item) => {
    if (item.grade === 1) {
      setdataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`http://localhost:5000/rights/${item.id}`)
    } else {
      let list = dataSource.filter(data => data.id === item.rightId)
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      setdataSource([...dataSource])
      axios.delete(`http://localhost:5000/children/${item.id}`)
    }
  }

  useEffect(() => {
    axios.get('http://localhost:5000/users?_expand=role').then(res => {
      const list = res.data;
      setdataSource(list)
    })
  }, [])

  useEffect(() => {
    axios.get('http://localhost:5000/regions').then(res => {
      setregionList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get('http://localhost:5000/roles').then(res => {
      setroleList(res.data)
    })
  }, [])


  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => {
        return <b>{region === "" ? '全球' : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default}></Switch>
      }
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
            onClick={() => showConfirm(item)}
            disabled={item.default}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            disabled={item.default}
          />
        </div>
      }
    }
  ];
  return (
    <div>
      <Button type="primary" onClick={() => {
        setVisible(true)
      }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />

      <Modal
        visible={visible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setVisible(false)
        }}
        onOk={() => {
          addForm.current.validateFields().then(value => {
            setVisible(false);
            axios.post('http://localhost:5000/users', {
              ...value,
              "roleState": true,
              "default": false,
            }).then(res=>{
              setdataSource([...dataSource,{
                ...res.data,
                role:roleList.filter(item=>item.id===value.roleId)[0]
              }])
            })
          }).catch(err => {
            console.log(err);
          })
        }}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>
    </div>
  )
}
