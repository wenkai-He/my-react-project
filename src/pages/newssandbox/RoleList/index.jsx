import React, { useState, useEffect } from 'react'
import { Button, Table, Modal, Tree } from 'antd'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
const { confirm } = Modal
export default function RoleList() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rightList, setrightList] = useState([])
  const [currentRights, setcurrentRights] = useState([])
  const [currentId, setcurrentId] = useState(0)
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      setrightList(res.data)
    })
  }, [])

  const handleOk = () => {
    setIsModalVisible(false);
    setdataSource(dataSource.map(item=>{
      if(item.id===currentId){
        return {
          ...item,
          rights:currentRights
        }
      }
      return item
    }))
    axios.patch(`/roles/${currentId}`,{
      rights:currentRights
    })
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onCheck=(checkedKeys)=>{
    setcurrentRights(checkedKeys.checked)
  }
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
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/roles/${item.id}`)
  }

  const [dataSource, setdataSource] = useState([])
  useEffect(() => {
    axios.get('/roles').then(res => {
      setdataSource(res.data);
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
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
          <Button
            type="primary"
            shape="circle"
            icon={<UnorderedListOutlined />}
            onClick={() => {
              setIsModalVisible(true);
              setcurrentRights(item.rights)
              setcurrentId(item.id)
            }
            }
          />
        </div>
      }
    }
  ];
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} />;
      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkStrictly={true}
          treeData={rightList}
          checkedKeys={currentRights}
          onCheck={onCheck}
        />
      </Modal>
    </div>
  )
}
