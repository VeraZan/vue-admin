<template>
  <el-table :data="data.tableData" border style="width: 100%">
    <!--多选框-->
    <el-table-column v-if="data.tableConfig.selection" type="selection" width="45" fixed="left"></el-table-column>

    <template v-for="item in data.tableConfig.tHead">
      <!--插槽-->
      <el-table-column
        :prop="item.field"
        :label="item.label"
        :key="item.field"
        :width="item.width"
        :fixed="item.fixed"
        v-if="item.columnType === 'slot'"
      >
        <template slot-scope="scope">
          <slot :name="item.slotName" :rowData="scope.row"></slot>
        </template>
      </el-table-column>
      <!--文本-->
      <el-table-column
        :prop="item.field"
        :label="item.label"
        :key="item.field"
        :width="item.width"
        :fixed="item.fixed"
        v-else
      >
      </el-table-column>
    </template>

  </el-table>
</template>

<script>
  import { reactive,onBeforeMount } from "@vue/composition-api";
  import { requestUrl } from "@/api/request";
  import { loadTableData } from "@/api/common";
  export default {
    name: "TableVue",
    props:{
      config:{
        type: Object,
        default: () => {}
      }
    },
    setup(props,{ root }){
      const data= reactive({
        tableConfig:{
          selection:true,
          tHead:[],
          requestData:{}
        },
        tableData:[]
      });
      let loadData = () => {
        let requestJson = data.tableConfig.requestData;
        let params = {
          url:requestUrl[requestJson.url],
          method:requestJson.method,
          data:requestJson.data
        };
        loadTableData(params).then(response => {
          let responseData = response.data.data.data;
          if(responseData && responseData.length !== 0){
            data.tableData = responseData;
          }
        }).catch(error => {

        })
      };
      let initTableConfig=()=>{
        let configData = props.config;
        let keys = Object.keys(data.tableConfig);
        for(let key in configData){
          if(configData.hasOwnProperty(key) && keys.includes(key)){
            data.tableConfig[key] = configData[key];
          }
        }
      };
      onBeforeMount(()=>{
        initTableConfig();
        loadData();
      });
      return{
        data
      }
    }
  }
</script>

<style scoped>

</style>
