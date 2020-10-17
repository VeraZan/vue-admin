import { Login } from '@/api/login';
import { setToKen,removeToKen,setUserName,getUserName,removeUserName } from '@/utils/app';

const state = {
  roles: [],
  buttonPermission: [],
  isCollapse:JSON.parse(sessionStorage.getItem('isCollapse')) || false,
  to_ken:"",
  username:getUserName() || ""
};
const getters = {
  isCollapse:state => state.isCollapse,
  roles: state => state.roles,
  buttonPermission: state => state.buttonPermission
};
const mutations = {
  SET_COLLAPSE(state){
    state.isCollapse = !state.isCollapse;
    sessionStorage.setItem('isCollapse',JSON.stringify(state.isCollapse));
  },
  SET_TOKEN(state,value){
    state.to_ken = value;
  },
  SET_USERNAME(state,value){
    state.username = value;
  },
  SET_ROLES(state,value){
    state.roles = value;
  },
  SET_BUTTON(state, value){
    state.buttonPermission = value;
  }
};
const actions = {
  login(content,requestData){
    return new Promise((resolve,reject) => {
      Login(requestData).then(response => {
        let data = response.data.data;
        content.commit("SET_TOKEN",data.token);
        content.commit("SET_USERNAME",data.username);
        setToKen(data.token);
        setUserName(data.username);
        resolve(response)
      }).catch(error => {
        reject()
      })
    })
  },
  exit({ commit }){
    return new Promise((resolve,reject) => {
      removeToKen();
      removeUserName();
      commit("SET_TOKEN","");
      commit("SET_USERNAME","");
      commit("SET_ROLES","");
      resolve();
    });
  }
};
export default {
  namespaced:true,
  state,
  getters,
  mutations,
  actions
}