import Vue from "vue";
import SvgIcon from "./SvgIcon"

Vue.component('svg-icon',SvgIcon);

/*
* require.context 读取指定目录所有文件
* 参数1：目录
* 参数2：是否遍历子级目录
* 参数3：定义遍历文件规则，/\.svg$/即为读取.svg结尾的文件
*/
const req = require.context('./svg', false, /\.svg$/); // 获取当前svg目录所有为.svg结尾的文件
const requireAll = (requireContext) => {
  return requireContext.keys().map(requireContext);  // 解析获取的.svg文件的文件名称，并返回
};
requireAll(req);