import { GetCategory } from "@/api/news";

const state = {
  qiniuUrl:`http://www-web-jshtml-cn-idva7mx.web-jshtml.cn/`
};
const getters = {
  qiniuUrl:state => state.qiniuUrl
};
const mutations = {

};
const actions = {
  getInfoCategory(content){
    return new Promise((resolve,reject) => {
      GetCategory().then(response => {
        resolve(response)
      }).catch(error => {
        reject()
      })
    })
  }
};
export default {
  namespaced:true,
  state,
  getters,
  mutations,
  actions
}