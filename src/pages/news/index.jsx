import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PageHeader, Card, Col, Row, List } from 'antd'
import { Link } from 'react-router-dom';
import _ from 'lodash'
export default function News() {
    const [list, setlist] = useState([])
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category').then(res => {
            setlist(Object.entries(_.groupBy(res.data, item => item.category.title)));
        })

    }, [])

    return (
        <div style={{
            width: '95%',
            margin: '0 auto'
        }}>
            <PageHeader
                className="site-page-header"
                title="全球大新闻"
                subTitle="查看新闻"
            />
            <div className="site-card-wrapper">
                <Row gutter={[16, 16]}>
                    {
                        list.map(item =>
                            <Col span={8} key={item[0]}>
                                <Card title={item[0]} hoverable>
                                    <List
                                        size="small"
                                        dataSource={item[1]}
                                        pagination={{
                                            pageSize: 3
                                        }}
                                        renderItem={data => <List.Item><Link to={`/news-manage/preview/${data.id}`}>{data.title}</Link></List.Item>}
                                    />
                                </Card>
                            </Col>)
                    }

                </Row>
            </div>
        </div>
    )
}
