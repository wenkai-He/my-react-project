import React, { forwardRef, useState } from 'react'
import { Select, Form, Input } from 'antd'
const UserForm = forwardRef((props, ref) => {
    const { Option } = Select;
    const [Disabled, setDisabled] = useState(false)
    return (
        <Form
            ref={ref}
            layout="vertical"
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="region"
                label="区域"
                rules={Disabled?[]:[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select disabled={Disabled}>
                    {
                        props.regionList.map(item =>
                            <Option value={item.value} key={item.id}>{item.title}</Option>
                        )
                    }
                </Select>
            </Form.Item>

            <Form.Item
                name="roleId"
                label="角色"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select onChange={(value) => {
                    if (value === 1) {
                        setDisabled(true)
                        ref.current.setFieldsValue({
                            region: ''
                        })
                    } else {
                        setDisabled(false)
                    }
                }}>
                    {
                        props.roleList.map(item =>
                            <Option value={item.id} key={item.id}>{item.roleName}</Option>
                        )
                    }
                </Select>
            </Form.Item>

        </Form>
    )
})
export default UserForm