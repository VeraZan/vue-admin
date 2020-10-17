import Vue from "vue";
import VueRouter from "vue-router";

// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter);

//引入布局组件
import Layout from '@/views/Layout'

//默认路由
export const defaultRouterMap  = [
  {
    path: "/",
    meta:{
      name:"主页"
    },
    hidden:true,
    redirect:"login"//重定向
  },
  {
    path: "/login",
    name: "Login",
    meta:{
      name:"登录"
    },
    hidden:true,
    component: ()=>import("../views/Login/index.vue")//此处记得箭头函数，不要直接import
  },
  {
    path: "/console",
    name: "Console",
    meta:{
      name:"控制台",
      icon:"console"
    },
    hidden:false,
    redirect:"index",
    component: Layout,
    children:[
      {
        path: "/index",
        name: "Index",
        meta:{
          name:"首页"
        },
        hidden:false,
        component: ()=>import("../views/Console/index.vue")
      }
    ]
  },
  {    
    path: "/page404",
    name: "page404",    
    meta:{
      name:"page404"
    },
    hidden:true,
    component: Layout,
    children:[
      {
        path: "/404",
        name: "404",
        meta:{
          name:"404"
        },
        hidden:false,
        component: ()=>import("../views/404/index.vue")
      }
    ]        
  }
];

const router = new VueRouter({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),//页面滚到顶部
  routes: defaultRouterMap
});

export default router;

//动态路由
export const asnycRouterMap = [
  {
    path: "/info",
    name: "Info",
    meta:{
      role: ['sale', 'manager'],
      name:"信息管理",
      icon:"info"
    },
    hidden:false,
    component: Layout,
    children:[
      {
        path: "/infoIndex",
        name: "InfoIndex",
        meta:{
          role: ['sale', 'manager'],
          name:"信息列表"
        },
        hidden:false,
        component: ()=>import("../views/Info/index.vue")
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        meta:{
          keepAlive:true,
          role: ['sale'],
          name:"信息分类"
        },
        hidden:false,
        component: ()=>import("../views/Info/category.vue")
      },
      {
        path: "/infoDetailed/:id",
        name: "infoDetailed",
        meta:{
          keepAlive:true,
          role: ['sale'],
          name:"信息详情"
        },
        hidden:true,
        component: ()=>import("../views/Info/detailed.vue")
      }
    ]
  },
  {
    path: "/user",
    name: "User",
    meta:{
      role: ['sale'],
      name:"用户管理",
      icon:"user"
    },
    hidden:false,
    component: Layout,
    children:[
      {
        path: "/userIndex",
        name: "UserIndex",
        meta:{
          role: ['sale'],
          name:"用户列表"
        },
        hidden:false,
        component: ()=>import("../views/User/index.vue")
      }
    ]
  },
  {
    path:"*",
    redirect:"404",
    hidden:true
  }
];