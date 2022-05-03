import React, { useState, useEffect } from 'react'
import { Modal, Button, Table, Tag, Popover, Switch } from 'antd'
import axios from 'axios'
import { ExclamationCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
export default function RightList() {
  const { confirm } = Modal;
  const [dataSource, setdataSource] = useState([
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ])
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
  //switch回调

  function onChange(item) {
    item.pagepermisson=item.pagepermisson===1?0:1;
    setdataSource([...dataSource])
    if(item.grade===1){
      axios.patch(`http://localhost:5000/rights/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }else{
      axios.patch(`http://localhost:5000/children/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
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
    axios.get('http://localhost:5000/rights?_embed=children').then(res => {
      const list = res.data;
      list.forEach(element => {
        if (element.children.length === 0) {
          element.children = ''
        }
      });
      setdataSource(list)
    })
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render: (tag) => {
        return <Tag color="orange">{tag}</Tag>
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
          />
          <Popover
            content={<div style={{ textAlign: 'center' }}><Switch defaultChecked={item.pagepermisson} onChange={()=>onChange(item)} /></div>}
            title="页面配置项"
            trigger={item.pagepermisson === undefined ? '' : "click"}
          >
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              disabled={item.pagepermisson === undefined}
            />
          </Popover>
        </div>
      }
    }
  ];
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  )
}
