import React from 'react'
import { Table, Tag} from 'antd'
import { Link } from 'react-router-dom';
export default function NewsPublish(props) {
  
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title,item) => {
        return <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <Tag color="orange">{category.title}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {props.button(item.id)}
        </div>
      }
    }
  ];
  return (
    <div>
      <Table dataSource={props.dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item=>item.id}/>
    </div>
  )
}
