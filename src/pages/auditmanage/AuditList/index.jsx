import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, notification } from 'antd'
import { Link } from 'react-router-dom';
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
export default function AuditList() {
    const navigate=useNavigate()
    const { username } = JSON.parse(localStorage.getItem('token'))
    const [dataSource, setdataSource] = useState([])
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(response => {
            setdataSource(response.data)
        })
    }, [username])
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
            title: '审核状态',
            dataIndex: 'auditState',
            render: (auditState) => {
                const colorList = ['black', 'orange', 'green', 'red']
                const auditList = ['未审核', '审核中', '已通过', '未通过']
                return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    {
                        item.auditState === 1 && <Button onClick={() => handleRervert(item)}>撤销</Button>

                    }
                    {
                        item.auditState === 2 && <Button danger onClick={()=>handlePublish(item)}>发布</Button>

                    }
                    {
                        item.auditState === 3 && <Button type='primary' onClick={()=>handleUpdate(item)}>更新</Button>

                    }
                </div>
            }
        }
    ];

    const handleRervert = (item) => {
        setdataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            auditState: 0
        }).then(() => {
            notification.info({
                message: '通知',
                description: '您可以到草稿箱中查看您编辑的新闻',
                placement: 'bottomRight'
            });
        })
    }

    const handleUpdate=(item)=>{
        navigate(`/news-manage/update/${item.id}`)
    }

    const handlePublish = (item) => {
        axios.patch(`/news/${item.id}`, {
            publishState: 2,
            publishTime:Date.now()
        }).then(() => {
            navigate('/publish-manage/published')
            notification.info({
                message: '通知',
                description: '您可以到发布管理中的已发布进行查看',
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
