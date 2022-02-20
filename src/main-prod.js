import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css';
import axios from 'axios';
//导入nprogress
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
Vue.component('tree-table', TreeTable)

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
//在request拦截器中展示进度条，NProgress.star()
axios.interceptors.request.use(config => {
   //进度条
   NProgress.start()
  //请求Authorization token验证字段
  config.headers.Authorization = window.sessionStorage.getItem('loginToken');
  console.log(config);
 
  return config;
})
//在response拦截器中隐藏进度条，NProgress.done()
axios.interceptors.response.use(config => {
  //隐藏进度条
  NProgress.done();
  return config;
})
Vue.prototype.$http = axios;
Vue.config.productionTip = false
Vue.use(ElementUI);

//时间过滤器
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear();
  const m = (dt.getMonth()+1+'').padStart(2,'0');
  const d = (dt.getDate()+'').padStart(2,'0');
  const hh = (dt.getHours()+'').padStart(2,'0');
  const mm = (dt.getMinutes()+'').padStart(2,'0');
  const ss = (dt.getSeconds()+'').padStart(2,'0');

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
