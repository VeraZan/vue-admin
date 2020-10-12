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
          tHead:[]
        },
        tableData:[
          {
            truename:"张三",
            phone:"18888888888",
            status:true
          }
        ]
      });
      const initTableConfig=()=>{
        let configData = props.config;
        for(let key in configData){
          if(configData.hasOwnProperty(key) && data.tableConfig[key]){
            data.tableConfig[key] = configData[key];
          }
        }
      };
      onBeforeMount(()=>{
        initTableConfig();
      });
      return{
        data
      }
    }
  }
</script>

<style scoped>

</style>
