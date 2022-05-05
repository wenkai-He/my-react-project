import axios from 'axios'
import React,{useState,useEffect} from 'react'
import { Table,Button,notification } from 'antd'
import { Link } from 'react-router-dom'
import { CheckCircleOutlined,CloseCircleOutlined } from '@ant-design/icons';
export default function Audit() {
  const [dataSource, setdataSource] = useState([])
  const {roleId,region,username}=JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      console.log(res.data);
      const list = res.data;
      setdataSource(roleId===1?list:[
        ...list.filter(item=>item.author===username),
        ...list.filter(item=>item.region===region&&item.roleId===3),
      ])
    })
  }, [username,roleId,region])
  
  const columns = [
    {
        title: '新闻标题',
        dataIndex: 'title',
        render: (title, item) => {
            return <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
        }
    },
    {
        title: '作者',
        dataIndex: 'author'
    },
    {
        title: '新闻分类',
        dataIndex: 'category',
        render: (category) => category.title
    },
    {
        title: '操作',
        render: (item) => {
            return <div>
                
                  <Button danger shape='circle' icon={<CloseCircleOutlined />} onClick={()=>handleAudit(item,3,0)}></Button>

                <Button type='primary' shape='circle' icon={<CheckCircleOutlined />} onClick={()=>handleAudit(item,2,1)}></Button>

              
            </div>
        }
    }
];

const handleAudit=(item,auditState,publishState)=>{
  setdataSource(dataSource.filter(data=>data.id!==item.id))
  axios.patch(`/news/${item.id}`,{
    auditState,
    publishState
  }).then(() => {
    notification.info({
        message: '通知',
        description: `您可以到[审核管理/审核列表]中查看您编辑的新闻`,
        placement: 'bottomRight'
    });
})
}


  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
    </div>
  )
}
