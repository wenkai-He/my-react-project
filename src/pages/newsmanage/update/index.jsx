import React, { useState, useEffect, useRef } from 'react'
import { PageHeader, Steps, Button, Input, Form, Select, message, notification } from 'antd';
import style from './index.module.css'
import axios from 'axios';
import NewsEditor from '@/components/news-manage/NewsEditor';
import { useNavigate, useParams } from 'react-router-dom';
const { Step } = Steps;
const { Option } = Select;
export default function Update() {
  const navigate = useNavigate()
  const [currentStep, setcurrentStep] = useState(0)
  const [categoryList, setcategoryList] = useState([])
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState('')
  const curId = useParams().id
  const NewsForm = useRef(null)
  const handleNext = () => {
    if (currentStep === 0) {
      NewsForm.current.validateFields().then(res => {
        setFormInfo(res)
        setcurrentStep(currentStep + 1)
      }).catch(err => {
        console.log(err);
      })
    } else {
      if (content === "" || content.trim() === "<p></p>") {
        message.error('新闻内容不能为空')
      } else {
        setcurrentStep(currentStep + 1)
      }

    }
  }

  const handlePrev = () => {
    setcurrentStep(currentStep - 1)
  }

  useEffect(() => {
    axios.get('/categories').then(res => {
      setcategoryList(res.data)
    })
  }, [])



  useEffect(() => {
    axios.get(`/news/${curId}?_expand=category&_expand=role`).then(res => {
      const { title, categoryId, content } = res.data;
      NewsForm.current.setFieldsValue({
        title,
        categoryId
      })
      setContent(content)
    })
  }, [curId])

  const handleSave = (auditState) => {
    axios.patch(`/news/${curId}`, {
      ...formInfo,
      'content': content,
      'auditState': auditState,
    }).then(res => {
      navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')

      notification.info({
        message: `通知`,
        description:
          `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="更新新闻"
        onBack={() => window.history.back()}
      />

      <Steps current={currentStep}>
        <Step title="基本信息" description="新闻标题，新闻类别" />
        <Step title="新闻内容" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿或提交审核" />
      </Steps>
      <div style={{ marginTop: '50px' }}>
        <div className={currentStep === 0 ? '' : style.active}>
          <Form
            name="basic"
            labelCol={{
              span: 2,
            }}
            wrapperCol={{
              span: 20,
            }}
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
            ref={NewsForm}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Select >
                {
                  categoryList.map(item => (
                    <Option key={item.id} value={item.id}>{item.value}</Option>
                  ))
                }

              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={currentStep === 1 ? '' : style.active}>
          <NewsEditor getContent={(value) => {
            console.log(value);
            setContent(value)
          }} content={content}></NewsEditor>
        </div>
        <div className={currentStep === 2 ? '' : style.active}></div>
      </div>


      <div style={{ marginTop: '50px' }} >
        {
          currentStep === 2 &&
          <span style={{ marginRight: '20px' }}>
            <Button type='primary' style={{ marginRight: '20px' }} onClick={() => handleSave(0)}>保存草稿箱</Button>
            <Button danger onClick={() => handleSave(1)}>提交审核</Button>
          </span>
        }
        {
          currentStep < 2 && <Button type="primary" style={{ marginRight: '20px' }} onClick={handleNext}>下一步</Button>
        }
        {
          currentStep > 0 && <Button onClick={handlePrev} >上一步</Button>
        }

      </div>
    </div>

  )
}




