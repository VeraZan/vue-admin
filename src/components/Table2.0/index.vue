<template>
  <div>
    <el-table :data="tableData" border style="width: 100%">
      <!--多选框-->
      <el-table-column v-if="tableConfig.selection" type="selection" width="45" fixed="left"></el-table-column>
      <template v-for="item in tableConfig.tHead">
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
      v-if="tableConfig.pagination.show"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :layout="tableConfig.pagination.layout"
      :total="total"
      background
    >
    </el-pagination>
  </div>
</template>

<script>
  import tableLoadData from "@/mixins/Table/tableLoadData";
  import paginationHook from "@/mixins/Table/paginationHook";
  export default {
    name: "TableVue",
    mixins:[tableLoadData,paginationHook],
    data(){
      return{
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
      }
    },
    props:{
      config:{
        type: Object,
        default: () => {}
      }
    },
    beforeMount(){
      this.initTableConfig();
    },
    methods:{
      initTableConfig(){
        let configData = this.config;
        let keys = Object.keys(this.tableConfig);
        for(let key in configData){
          if(configData.hasOwnProperty(key) && keys.includes(key)){
            this.tableConfig[key] = configData[key];
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>