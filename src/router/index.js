import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

//引入布局组件
import Layout from '@/views/Layout'

const routes = [
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
    path: "/info",
    name: "Info",
    meta:{
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
          name:"信息列表"
        },
        hidden:false,
        component: ()=>import("../views/Info/index.vue")
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        meta:{
          name:"信息分类"
        },
        hidden:false,
        component: ()=>import("../views/Info/category.vue")
      }
    ]
  },
  {
    path: "/user",
    name: "User",
    meta:{
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
          name:"用户列表"
        },
        hidden:false,
        component: ()=>import("../views/User/index.vue")
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
