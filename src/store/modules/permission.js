import { getUserRole } from "@/api/login";
import { defaultRouterMap, asnycRouterMap } from "@/router";

function hasPremission(roles, router) {
  if (router.meta && router.meta.role) {
    return roles.some(item => router.meta.role.indexOf(item) >= 0)
  }
}

const state = {
  allRouters: defaultRouterMap,
  addRouters: [],
};
const getters = {
  allRouters: state => state.allRouters,
  addRouters: state => state.addRouters
};
const mutations = {
  SET_ROUTER(state, router) {
    state.addRouters = router;
    state.allRouters = defaultRouterMap.concat(router);
  }
};
const actions = {
  //获取用户角色
  getRoles({ commit }, repuestData) {
    return new Promise((resolve, reject) => {
      getUserRole().then(response => {
        let data = response.data.data;
        resolve(data);
      })
    })
  },
  //创建动态路由
  createRouter({ commit }, data) {
    return new Promise((resolve, reject) => {
      let role = data;
      // 超管的状态
      let addRouters = [];
      if (role.includes('admin')) {//管理员默认拥有所有权限
        addRouters = asnycRouterMap
      } else { // 普通管理员 
        addRouters = asnycRouterMap.filter(item => {
          if (hasPremission(role, item)) {
            // 优先判断 
            if (item.children && item.children.length > 0) {
              item.children = item.children.filter(child => {
                if (hasPremission(role, child)) {
                  return child;
                }
              });
              return item;
            }
            return item;
          }
        });
        addRouters.push(asnycRouterMap[asnycRouterMap.length - 1]);//404
      }
      // 更新路由
      commit('SET_ROUTER', addRouters);
      resolve()
    })
  }
};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}