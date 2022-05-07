import axios from 'axios'
import {store} from '@/redux/store';
import nprogress from "nprogress";
import "nprogress/nprogress.css";
axios.defaults.baseURL='http://localhost:5000'

axios.interceptors.request.use(function (config) {
    store.dispatch({
        type:'change_loading',
        payload:true
    })
    nprogress.start()
    return config;
  }, function (error) {
    
    return Promise.reject(error);
  });


axios.interceptors.response.use(function (response) {
    store.dispatch({
        type:'change_loading',
        payload:false
    })
    nprogress.done()
    return response;
  }, function (error) {
    
    return Promise.reject(error);
  });
