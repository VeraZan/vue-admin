<template>
    <el-select v-model="data.searchValue" placeholder="请选择" @change="select">
        <el-option
          v-for="item in data.initOption"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
    </el-select>
</template>

<script>
  import {  reactive,onBeforeMount  } from "@vue/composition-api";
  export default {
    name: "SelectVue",
    props:{
      config:{
        type:Object,
        default:()=>{}
      },
      selectData: {
        type: Object,
        default: () => {}
      }
    },
    setup(props,{ root,emit }){
      const data = reactive({
        searchValue:"",
        initOption:[],
        option:[
          {value:"username",label:"邮箱"},
          {value:"truename",label:"姓名"},
          {value:"phone",label:"手机号"},
          {value:"id",label: "ID"},
          {value:"title",label: "标题"}
        ]
      });
      /**
       * 初始化下拉选择
       */
      const initOption = () => {
        let initData=props.config.init;
        if(initData.length === 0){
          return false;
        }
        let optionArr=[];
        initData.forEach(item=>{
          let arr = data.option.filter(elem => elem.value === item);
          if(arr.length > 0){
            optionArr.push(arr[0]);
          }
        });
        if(optionArr.length === 0){
          return false;
        }
        data.initOption = optionArr;
        data.searchValue = optionArr[0].value;
      };
      /**
       * 选择改变触发
       */
      const select = (val) => {
        let filterData = data.option.filter(item => item.value == val)[0];
        emit("update:selectData", filterData);
      }
      onBeforeMount(()=>{
       initOption()
      });
      return{
        data,
        select
      }
    }
  }
</script>

<style scoped>

</style>
<!--
目录位置：/src/components/Select/index.vue
引用方式：import  SelectVue from "@c/Select";
template：<SelectVue :config="data.configOption"/>
参数配置：
configOption:{
  init:["username","truename","phone"]
}
configOption：Object对象
init：Array数组
-->
