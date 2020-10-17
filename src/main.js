import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueCompositionApi from "@vue/composition-api";
//路由守卫
import "./router/premit";
//自定义指令验证按钮权限
import "./utils/buttonPerm";
//自定义全局组件--图标
import './icons'

Vue.use(ElementUI);
Vue.use(VueCompositionApi);

Vue.config.productionTip = false;

//runtime模式
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
