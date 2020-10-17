import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import common from "./modules/common";
import permission from "./modules/permission";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    common,
    permission
  }
});
