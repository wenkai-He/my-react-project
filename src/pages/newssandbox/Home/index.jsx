import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash'
import *as echarts from 'echarts'
const { Meta } = Card;
export default function Home() {
  const [viewData, setviewData] = useState([])
  const [starData, setstarData] = useState([])
  const [allList, setallList] = useState([])
  const [visible, setVisible] = useState(false);
  const [pieChart, setpieChart] = useState(null)
  const barRef = useRef(null)
  const pieRef = useRef(null)
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res => {
      setviewData(res.data)

    })
  }, [])

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res => {
      setstarData(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category').then(res => {
      renderBarView(_.groupBy(res.data, item => item.category.title))
      setallList(res.data)
    })
    return () => {
      window.onresize = null
    }

  }, [])

  const renderBarView = (data) => {
    var myChart = echarts.init(barRef.current);
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(data)
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(data).map(item => item.length)
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.onresize = () => {
      myChart.resize()
    }
  }
  const renderPieView = (data) => {
    var currentList=allList.filter(item=>item.author===username)
    var groubObj=_.groupBy(currentList,item=>item.category.title)
    var list=[]
    for(var i in groubObj){
      list.push({
        name:i,
        value:groubObj[i].length
      })
    }
    var myChart;
    if (!pieChart) {
      myChart = echarts.init(pieRef.current);
      setpieChart(myChart)
    } else {
      myChart = pieChart
    }
    var option = {
      title: {
        text: '当前用户新闻分类图示',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    myChart.setOption(option);

  }


  const showDrawer = () => {
    setVisible(true);
    setTimeout(() => {
      renderPieView()
    });
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              dataSource={viewData}
              renderItem={item => <List.Item><Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link></List.Item>}

            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              dataSource={starData}
              renderItem={item => <List.Item><Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={showDrawer} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b>{region ? region : '全球'}</b>
                  <span style={{
                    paddingLeft: '15px'
                  }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      <Drawer title="个人新闻分类" placement="right" onClose={onClose} visible={visible} width="500px">
        <div ref={pieRef} style={{ height: '400px', marginTop: '30px', width: '100%' }}></div>
      </Drawer>

      <div ref={barRef} style={{ height: '400px', marginTop: '30px', width: '100%' }}></div>
    </div>
  )
}
