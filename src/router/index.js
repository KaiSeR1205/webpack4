import Vue from 'vue'
import Router from 'vue-router'
const createSkeletonHTML = require('js/evalDOM.js')
Vue.use(Router)
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'grid-router',
      component: () => import('@/grid-router'),
      meta:{keepAlive:true}
    },
    {
      path: '/grid-demo-all',
      name: 'grid-demo-all',
      component: () => import('@/grid-demo-all'),
      meta:{keepAlive:true}
    },
    {
      path: '/grid-demo',
      name: 'grid-demo',
      component: () => import('@/grid-demo'),
      meta:{keepAlive:true}
    },
    {
      path: '/grid-demo-to-grid',
      name: 'grid-demo-to-grid',
      component: () => import('@/grid-demo-to-grid'),
      meta:{keepAlive:true}
    },
    {
      path: '/grid-demo-config',
      name: 'grid-demo-config',
      component: () => import('@/grid-demo-config'),
      meta:{keepAlive:true}
    },
    {
      path: '/grid-demo-slot',
      name: 'grid-demo-slot',
      component: () => import('@/grid-demo-slot'),
      meta:{keepAlive:true}           
    },
    {
      path: '/grid-demo-mergeColumn',
      name: 'grid-demo-mergeColumn',
      component: () => import('@/grid-demo-mergeColumn'),
      meta:{keepAlive:true}
    },
    {
      path: '/grid-demo-moreHeader',
      name: 'grid-demo-moreHeader',
      component: () => import('@/grid-demo-moreHeader'),
      meta:{keepAlive:true}
    },
    {
      path: '/grid-demo-filter',
      name: 'grid-demo-filter',
      component: () => import('@/grid-demo-filter'),
      meta:{keepAlive:true}
    },
    {
      path: '/grid-demo-filter',
      name: 'grid-demo-filter',
      component: () => import('@/grid-demo-filter'),
      meta:{keepAlive:true}
    },
    {
      path: '/grid-demo-other',
      name: 'grid-demo-other',
      component: () => import('@/grid-demo-other'),
      meta:{keepAlive:true}
    },
    {
      path: '/grid-demo-lazy-tree',
      name: 'grid-demo-lazy-tree',
      component: () => import('@/grid-demo-lazy-tree'),
      meta:{keepAlive:true}
    },
    {
      path: '/grid-demo-tree',
      name: 'grid-demo-tree',
      component: () => import('@/grid-demo-tree'),
      meta:{keepAlive:true}
    },
    {
      path: '/basci-grid',
      name: 'basci-grid',
      component: () => import('@/basci-grid'),
      meta:{keepAlive:true}
    },
    {
      path: '/upload-Demo',
      name: 'upload-Demo',
      component: () => import('@/upload-Demo'),
      meta:{keepAlive:true}
    },
    {
      path: '/tree',
      name: 'tree',
      component: () => import('@/tree'),
      meta:{keepAlive:true}
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('@/index'),
      meta:{keepAlive:true}
    },
    {
      path: '/router_query',
      name: 'router_query',
      component: () => import('@/router_query'),
    },
    {
      path: '/router_params',
      name: 'router_params',
      component: () => import('@/router_params'),
      meta:{keepAlive:true}
    },
    {
      path: '/cascader-lazy',
      name: 'cascader-lazy',
      component: () => import('@/cascader-lazy'),
      meta:{keepAlive:true}
    },
    {
      path: '/allNotice',
      name: 'allNotice',
      component: () => import('@/work/allNotice'),
      meta:{keepAlive:true}
    },
    {
      path: '/allToDoTask',
      name: 'allToDoTask',
      component: () => import('@/work/allToDoTask'),
      meta:{keepAlive:true}
    },
    {
      path: '/integral',
      name: 'integral',
      component: () => import('@/work/integral'),
      meta:{keepAlive:true}
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/work/test'),
      meta:{keepAlive:true}
    }
  ],
})

//router.beforeEach    路由跳转前执行

//router.beforeResolve  vue2.5新增  导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后， 解析守卫就被调用     

//router.afterEach     路由跳转后执行

router.afterEach((to, from, next) => {
  //路由跳转的时候关闭所有前一个页面的弹出层
  for(var i=0,nodes=document.querySelectorAll('.v-modal');i<nodes.length;i++){
    nodes[i].parentNode.removeChild(nodes[i]);
  }
  //加载骨架
  if((to.fullPath =="/" && from.fullPath =="/")||to.fullPath!=="/"){
    document.getElementById('convertApp').style.display=""
    createSkeletonHTML({
      background: '#eee',
      animation: 'opacity 1s linear infinite;'
    }).then(skeletonHTML => {
      document.getElementById('convertApp').style.display="none"
    }).catch(e => {
        console.error(e)
    }) 
  }
})



export default router

