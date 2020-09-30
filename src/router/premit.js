import router from "./index";
import store from "@/store/index"
import { getToKen,removeToKen,removeUserName } from "@/utils/app";

const whiteRouter = ['/login'];//indexOf方法，判断数组中是否存在指定的某个对象，如果不存在，则返回-1

//路由守卫
router.beforeEach((to,from,next) => {
  if(getToKen()){
    if(to.path === "/login"){
      removeToKen();
      removeUserName();
      store.commit("app/SET_TOKEN","");
      store.commit("app/SET_USERNAME","");
    }
    next();
  }else{
    //next("/login")//路由指向，此处不能直接指向登录页面，会导致死循环
    if(whiteRouter.indexOf(to.path) !== -1){//要跳转的路径是whiteRouter（路由白名单）中的路径之一
      next();
    }else{
      next("/login")
    }
  }
});