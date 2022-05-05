import axios from 'axios'
import { useEffect, useState } from 'react'
import { notification } from 'antd';
export default function usePublish(type) {
    const { username } = JSON.parse(localStorage.getItem('token'));
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            setDataSource(res.data);
        })
    }, [username,type])


    const handlePublish=(id)=>{
        setDataSource(dataSource.filter(item=>item.id!==id))

        axios.patch(`/news/${id}`, {
            publishState: 2,
            publishTime:Date.now()
        }).then(() => {
            notification.info({
                message: '通知',
                description: '您可以到发布管理/已发布中的已发布进行查看',
                placement: 'bottomRight'
            });
        })
        
    }

    const handleSunset=(id)=>{
        setDataSource(dataSource.filter(item=>item.id!==id))

        axios.patch(`/news/${id}`, {
            publishState: 3,
        }).then(() => {
            notification.info({
                message: '通知',
                description: '您可以到发布管理/已下线中的已发布进行查看',
                placement: 'bottomRight'
            });
        })
    }

    const handleDelete=(id)=>{
        setDataSource(dataSource.filter(item=>item.id!==id))

        axios.delete(`/news/${id}`, {
        }).then(() => {
            notification.info({
                message: '通知',
                description: '您已经成功删除',
                placement: 'bottomRight'
            });
        })
    
    }



    return {
        dataSource,
        handleDelete,
        handlePublish,
        handleSunset
    }
        
    
}
