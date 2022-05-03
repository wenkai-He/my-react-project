import React, { useState, useEffect, useRef } from 'react'
import { Modal, Button, Table, Switch } from 'antd'
import axios from 'axios'
import { ExclamationCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import UserForm from '@/components/user-manage/UserForm';
const { confirm } = Modal;
export default function UserList() {
  //用户状态
  const [dataSource, setdataSource] = useState([])
  //添加框状态
  const [visible, setVisible] = useState(false);
  //更新框状态
  const [updateVisible, setupdateVisible] = useState(false);
  //区域列表状态
  const [regionList, setregionList] = useState([])
  //职位列表状态
  const [roleList, setroleList] = useState([])
  //表单ref
  const addForm = useRef(null)
  //更新ref
  const updateForm = useRef(null)

  const [current, setcurrent] = useState(null)
  const [updateDisabled, setupdateDisabled] = useState(false)
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
  //删除操作
  const deleteMethod = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))

    axios.delete(`http://localhost:5000/users/${item.id}`)

  }

  //操作开关
  const handleChange = (item) => {
    item.roleState = !item.roleState
    setdataSource([...dataSource])

    axios.patch(`http://localhost:5000/users/${item.id}`, {
      roleState: item.roleState
    })
  }
  //更新用户信息
  const handlerUpdate = (item) => {
    setupdateVisible(true)
    setTimeout(() => {
      if (item.roleId === 1) {
        setupdateDisabled(true)
      } else {
        setupdateDisabled(false)
      }
      updateForm.current.setFieldsValue(item)
    }, 0);
    setcurrent(item)
  }

  //请求用户信息
  useEffect(() => {
    const {roleId,region,username}=JSON.parse(localStorage.getItem('token'))
    axios.get('http://localhost:5000/users?_expand=role').then(res => {
      const list = res.data;
      setdataSource(roleId===1?list:[
        ...list.filter(item=>item.username===username),
        ...list.filter(item=>item.region===region&&item.roleId===3),
      ])
    })
  }, [])
  //请求区域列表
  useEffect(() => {
    axios.get('http://localhost:5000/regions').then(res => {
      setregionList(res.data)
    })
  }, [])
  //请求职位列表
  useEffect(() => {
    axios.get('http://localhost:5000/roles').then(res => {
      setroleList(res.data)
    })
  }, [])

  //表格列信息
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        })),
        {
          text: '全球',
          value: '全球'
        }
      ],
      onFilter: (value, item) => {
        if (value === '全球') {
          return item.region === ""
        }
        return item.region === value

      },
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
        return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)}></Switch>
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
            onClick={() =>
              handlerUpdate(item)
            }
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
            addForm.current.resetFields()
            axios.post('http://localhost:5000/users', {
              ...value,
              "roleState": true,
              "default": false,
            }).then(res => {
              setdataSource([...dataSource, {
                ...res.data,
                role: roleList.filter(item => item.id === value.roleId)[0]
              }])
            })
          }).catch(err => {
            console.log(err);
          })
        }}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>

      <Modal
        visible={updateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setupdateVisible(false)
          setupdateDisabled(!updateDisabled)
        }}
        onOk={() => {
          updateForm.current.validateFields().then(value => {
            setupdateVisible(false)
            setdataSource(dataSource.map(item => {
              if (item.id === current.id) {
                return {
                  ...item,
                  ...value,
                  role: roleList.filter(data => data.id === value.roleId)[0]
                }
              }
              return item
            }))
            setupdateDisabled(!updateDisabled)
            axios.patch(`http://localhost:5000/users/${current.id}`, value)
          })
        }
        }
      >
        <UserForm regionList={regionList} roleList={roleList} ref={updateForm} updateDisabled={updateDisabled} isUpdate={true}></UserForm>
      </Modal>
    </div>
  )
}
