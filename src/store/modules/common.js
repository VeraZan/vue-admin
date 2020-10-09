import { GetCategory } from "@/api/news";

const state = {

};
const getters = {

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