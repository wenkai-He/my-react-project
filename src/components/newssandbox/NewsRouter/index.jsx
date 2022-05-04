import React,{useEffect,useState} from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from '@/pages/newssandbox/Home'
import UserList from '@/pages/newssandbox/UserList'
import RoleList from '@/pages/newssandbox/RoleList'
import RightList from '@/pages/newssandbox/RightList'
import NotFound from '@/pages/newssandbox/NotFound'
import Add from '@/pages/newsmanage/add'
import Draft from '@/pages/newsmanage/draft'
import Category from '@/pages/newsmanage/category'
import Audit from '@/pages/auditmanage/Audit'
import AuditList from '@/components/user-manage/AuditList'
import Unpublished from '@/pages/publishmanage/Unpublished'
import Published from '@/pages/publishmanage/Published'
import Sunset from '@/pages/publishmanage/Sunset'
import Preview from '@/pages/newsmanage/preview'
import Update from '@/pages/newsmanage/update'
import axios from 'axios'
const localRouterMap={
    "/home":Home,
    '/user-manage/list':<UserList />,
    '/right-manage/role/list':<RoleList/>,
    '/right-manage/right/list':<RightList/>,
    '/news-manage/add':<Add/>,
    "/news-manage/draft":<Draft/>,
    "/news-manage/category":<Category/>,
    "/news-manage/preview/:id":<Preview/>,
    "/news-manage/update/:id":<Update/>,
    "/audit-manage/audit":<Audit/>,
    "/audit-manage/list":<AuditList/>,
    "/publish-manage/unpublished":<Unpublished/>,
    "/publish-manage/published":<Published/>,
    "/publish-manage/sunset":<Sunset/>
}

export default function NewsRouter() {
    const [RouteList, setRouteList] = useState([])
    useEffect(() => {
      Promise.all([axios.get('/rights'),axios.get('/children')]).then(res=>{
          setRouteList([...res[0].data,...res[1].data])
      })
    
     
    }, [])


    const { role:{rights} } = JSON.parse(localStorage.getItem('token'))

    const checkRoute=(item)=>{
        return localRouterMap[item.key]&&(item.pagepermisson||item.routepermisson)
    }
    
    const checkUserPermission=(item)=>{
        return rights.includes(item.key)
    }

  return (
  
        <Routes>
            {
                RouteList.map(item=>
                    {
                        if(checkRoute(item)&&checkUserPermission(item)){
                            return <Route path={item.key} key={item.key} element={localRouterMap[item.key]}/>
                        }
                            return null
                        
                    }
                )
            }

            <Route path='/' element={<Navigate to="/home" exact/>} />
            {
                RouteList.length>0&&<Route path='*' element={<NotFound />}></Route>
            }
          </Routes>
    
  )
}
