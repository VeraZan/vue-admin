import Vue from "vue";
import store from "../store/index.js";
// 自定义指令
Vue.directive("btnPerm", {
  // 父级未渲染
  bind: function (el, binding, vnode) {
    // el 绑定的对象 DOM，原生JS处理
    // 操作DOM
    /*if (!binding.def.hasBtnPerm(binding.value)) {
      el.style.visibility="hidden";
    }*/
  },
  // 操作父节点，inserted内el.parentElement才能获取到父节点，bind中获取到为null
  inserted: function (el, binding) { 
    if (!binding.def.hasBtnPerm(binding.value)) {
      el.parentElement.removeChild(el);
    }
  },
  update: function () { },
  componentUpdated: function () { },
  unbind: function () { },
  //自定义方法hasBtnPerm，判断用户所在角色有无对应按钮权限
  hasBtnPerm: function (permission) {
    const button = store.getters["app/buttonPermission"]; // 请求到的数据权限
    const roles = store.getters["app/roles"]; // 获取角色 
    // 如果是超级管理员
    if (roles.includes("admin")) { return true }
    return button.indexOf(permission) !== -1; //
  }
})