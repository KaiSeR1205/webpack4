import Vue from 'vue'
import Router from 'vue-router'

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
      path: '/grid-demo-tree',
      name: 'grid-demo-tree',
      component: () => import('@/grid-demo-tree'),
      meta:{keepAlive:true}
    },
    {
      path: '/grid-demo-lazy-tree',
      name: 'grid-demo-lazy-tree',
      component: () => import('@/grid-demo-lazy-tree'),
      meta:{keepAlive:true}
    },
    {
      path: '/basci-grid',
      name: 'basci-grid',
      component: () => import('@/basci-grid'),
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
    }
  ],
})

export default router

