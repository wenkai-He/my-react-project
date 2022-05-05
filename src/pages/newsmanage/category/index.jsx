import React from 'react'
import axios from 'axios'
import { useEffect,useState,useContext,useRef} from 'react'
import { Table,Button,Modal,Form,Input, message} from 'antd'
import { DeleteOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
const { confirm } = Modal;
const EditableContext = React.createContext(null);


function Category() {
  const [dataSource,setdateSource]=useState([])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <b>{id}</b>,
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex:  'title',
        title: '栏目名称',
        handleSave: handleSave,
      }),
    },
    {
      title: '操作',
      render: (item) =><Button danger shape="circle" ghost icon={<DeleteOutlined />} onClick={() => handleDelete(item)}></Button>
    },
  ]

  useEffect(()=>{
    fetchData()

  },[])
  
  //获取新闻分类列表
  const fetchData=()=>{
      axios.get('/categories').then(response=>{
        setdateSource(response.data)
      })
  }
    //删除
  const handleDelete = (item) => {
    confirm({
      title: '您确定要删除此项数据吗?',
      icon: <ExclamationCircleOutlined />,
      okText:"确认",
      cancelText: "取消",
      
      onOk() {
        confirmDelete(item)
      },
      onCancel() {

      },
    });
  }

  //确认删除
  const confirmDelete = (item) => { 
    axios.delete(`/categories/${item.id}`).then(() => {
      fetchData() 
    })
  }

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
  };
  

  //可编辑单元格
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  
  //修改后的值
  const handleSave=(row)=>{
    setdateSource(dataSource.map(item=>{
      if(item.id===row.id){
        return row
      }else{
        return item
      }
    }))
    axios.patch(`/categories/${row.id}`,{
      title:row.title
    }).then(()=>{
      message.success('修改成功');
    })
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
      pagination={{pageSize: 5}}
      components={components}
      rowKey={item=>item.id}/>
    </div>
  )
}

export default Category