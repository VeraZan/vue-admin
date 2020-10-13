<template>
  <div>
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
    <el-pagination
      class="pull-right"
      v-if="data.tableConfig.pagination.show"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageData.currentPage"
      :page-sizes="pageData.pageSizes"
      :page-size="pageData.pageSize"
      :layout="data.tableConfig.pagination.layout"
      :total="pageData.total"
      background
    >
    </el-pagination>
  </div>
</template>

<script>
  import { reactive,onBeforeMount,watch } from "@vue/composition-api";
  import { loadData } from "./tableLoadData";
  import { paginationHook } from "./paginationHook";

  export default {
    name: "TableVue",
    props:{
      config:{
        type: Object,
        default: () => {}
      }
    },
    setup(props,{ root }){
      //加载数据
      const { tableData,tableLoadData } = loadData();
      //分页
      const { pageData,handleSizeChange,handleCurrentChange,totalCount } = paginationHook();
      const data= reactive({
        tableConfig:{
          selection:true,
          tHead:[],
          requestData:{},
          pagination:{
            show:true,
            layout: "total, sizes, prev, pager, next, jumper"
          }
        },
        tableData:[]
      });
      const initTableConfig=()=>{
        let configData = props.config;
        let keys = Object.keys(data.tableConfig);
        for(let key in configData){
          if(configData.hasOwnProperty(key) && keys.includes(key)){
            data.tableConfig[key] = configData[key];
          }
        }
      };
      //watch(() => tableData.item,(newValue,oldValue) =>  data.tableData = newValue);
      //表格数据监听
      watch(
        [
          () => tableData.item,
          () => tableData.total
        ],
        ([item, total]) => {
          data.tableData = item;
          totalCount(total);
        }
      );
      // 页码监听
      watch(
        [
          () => pageData.currentPage,
          () => pageData.pageSize
        ],
        ([currentPage, pageSize]) => {
          let requestData = data.tableConfig.requestData;
          if(requestData.data) {
            requestData.data.pageNumber = currentPage;
            requestData.data.pageSize = pageSize;
            tableLoadData(data.tableConfig.requestData);
          }
        }
      );
      onBeforeMount(()=>{
        initTableConfig();
        tableLoadData(data.tableConfig.requestData);
      });
      return{
        data,pageData,
        handleSizeChange,handleCurrentChange
      }
    }
  }
</script>

<style scoped>

</style>
