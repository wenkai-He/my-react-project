import NewsPublish from '@/components/publishmanage/newspublish';
import usePublish from '@/components/usePublish';
import { Button } from 'antd';
export default function Unpublished() {
  const { dataSource,handlePublish } = usePublish(1)

  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id)=><Button type='primary' onClick={()=>handlePublish(id)}>发布</Button>}></NewsPublish>
    </div>
  )
}
