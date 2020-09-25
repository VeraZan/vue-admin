import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect:"login"//重定向
  },
  {
    path: "/login",
    name: "Login",
    component: ()=>import("../views/Login/index.vue")//此处记得箭头函数，不要直接import
  }
];

const router = new VueRouter({
  routes
});

export default router;
