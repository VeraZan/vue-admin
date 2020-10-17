<template>
  <div>
    <!--表单-->
    <el-row :gutter="16">
      <el-col :span="4">
        <div class="label-wrap category">
          <label>分类：</label>
          <div class="wrap-content">
            <el-select v-model="category_value" placeholder="请选择">
              <el-option
                  v-for="item in options.category"
                  :key="item.id"
                  :label="item.category_name"
                  :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="label-wrap date">
          <label>日期：</label>
          <div class="wrap-content">
            <el-date-picker
                v-model="date_value"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="label-wrap key-word">
          <label>关键字：</label>
          <div class="wrap-content">
            <el-select v-model="search_key" placeholder="请选择">
              <el-option
                  v-for="item in search_option"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <el-input v-model="search_keyWork" placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" size="medium" @click="getList" style="width: 100%">搜索</el-button>
      </el-col>
      <el-col :span="2" :offset="2">
        <el-button type="danger" size="medium" class="pull-right" style="width: 100%" @click="addItem" v-btnPerm="'info:add'">新增</el-button>
      </el-col>
    </el-row>
    <!--表格-->
    <div class="black-space-30"></div>
    <el-table :data="table_data.item" v-loading="loadingData" @selection-change="handleSelectionChange" border style="width: 100%">
      <el-table-column type="selection" fixed="left" width="45"></el-table-column>
      <el-table-column prop="title" label="标题" width="830"></el-table-column>
      <el-table-column prop="categoryId" label="类型" width="130" :formatter="toCategory"></el-table-column>
      <el-table-column prop="createDate" label="日期" width="237" :formatter="toDate"></el-table-column>
      <el-table-column prop="user" label="管理员" width="115"></el-table-column>
      <el-table-column label="操作" fixed="right" width="250">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteItem(scope.row.id)" v-btnPerm="'info:del'">删除</el-button>
          <el-button type="success" size="mini" @click="editItem(scope.row.id)" v-btnPerm="'info:edit'">编辑</el-button>
          <el-button type="warning" size="mini" @click="editDetail(scope.row.id)" v-btnPerm="'info:detailed'">编辑详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--底部分页-->
    <div class="black-space-30"></div>
    <el-row>
      <el-col :span="12">
        <el-button size="medium" @click="deleteAll" v-btnPerm="'info:batchDel'">批量删除</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next,jumper"
            :total="total"
            class="pull-right">
        </el-pagination>
      </el-col>
    </el-row>
    <DialogInfo :flag.sync="dialog_info" :category="options.category" :operateType="operateType" @refreshList="getList"/> <!--@close="closeDialog"-->
  </div>
</template>

<script>
  import DialogInfo from "./dialog/info";
  import { GetList,DeleteInfo } from "@/api/news";
  import { global } from "@/utils/global";
  import { timestampToTime } from "@/utils/common";
  import { reactive,ref,onMounted } from "@vue/composition-api";

  export default {
    name: "InfoIndex",
    components:{ DialogInfo },
    setup(props,{ root }){

      //ref
      const category_value =  ref('');
      const date_value =  ref('');
      const search_key =  ref('id');
      const search_keyWork =  ref('');
      const dialog_info =  ref(false);
      const loadingData =  ref(true);
      const total =  ref(0);
      const deleteInfoId =  ref('');
      //reactive
      const options=reactive({
        category:[]
      });
      const search_option=reactive([
        { value: "id", label: "ID"},
        { value: "title", label: "标题"},
      ]);
      const table_data = reactive({
        item:[]
      });
      const page = reactive({
        pageNumber:1,
        pageSize:10
      });
      const operateType = reactive({
        type:"add",
        id:""
      });
      const { confirm } = global();//confirm如果写为confirm:abc,相当于把confirm重命名为abc，调用时写abc即可
      //methods
      const handleSizeChange = (val) => {
        page.pageSize = val;
        getList();
      };
      const handleCurrentChange = (val) => {
        page.pageNumber = val;
        getList();
      };
      const toCategory = (row, column, cellValue, index) => {
        let infoItem = options.category.filter(item => item.id === cellValue);
        if(infoItem.length !== 0){
          return infoItem[0]["category_name"]
        }else{
          return "";
        }
      };
      const toDate = (row, column, cellValue, index) => {
        return timestampToTime(cellValue);
      };
      const handleSelectionChange = (val) => {
        deleteInfoId.value = val.map(item => item.id).join(",");
      };
      const addItem = () => {
        operateType.type="add";
        operateType.id="";
        dialog_info.value = true;
      };
      const editItem = (id) => {
        operateType.type="edit";
        operateType.id=id;
        dialog_info.value = true;
      };
      const editDetail = (id) => {
        root.$router.push({
          name: "infoDetailed",
          params:{
            id: id
          }
        })
      };
      const deleteItem = (id) => {
        confirm({
          content:"确认删除此条信息？确认后将无法恢复！",
          tip:"警告",
          fn:confirmDelete,
          data:{id:[id],type:"single"}
        })
      };
      const deleteAll = () => {
        if(!deleteInfoId.value || deleteInfoId.value.length === 0){
          root.$message.error("请选择要删除的数据");
          return false;
        }
        confirm({
          content:"确认删除选中信息？确认后将无法恢复！",
          tip:"警告",
          fn:confirmDelete,
          data:{id:deleteInfoId.value.split(","),type:"multiple"}
        })
      };
      const confirmDelete = (data) => {
        DeleteInfo({id:data.id}).then(response => {
          root.$message.success(response.data.message);
          if(data.type === "multiple"){
            deleteInfoId.value = '';
          }
          getList();
        }).catch(error => {

        })
      };
      /*const closeDialog = (val) =>{
        dialog_info.value = val;
      };*/
      const getInfoCategory = () => {
        root.$store.dispatch("common/getInfoCategory").then(response=>{
          options.category = response.data.data.data;
        });
      };
      const formatData = () => {
        let requestData = {
          pageNumber: page.pageNumber,
          pageSize: page.pageSize
        };
        if(category_value.value){
          requestData.categoryId = category_value.value;
        }
        if(date_value.value.length > 0){
          requestData.startTiem = date_value.value[0];
          requestData.endTime = date_value.value[1];
        }
        if(search_keyWork.value){
          requestData[search_key.value] = search_keyWork.value;
        }
        return requestData;
      };
      const getList = () => {
        let requestData = formatData();
        loadingData.value = true;
        GetList(requestData).then(response=>{
          let data = response.data.data;
          table_data.item = data.data;
          total.value = data.total;
          loadingData.value = false;
        }).catch(error => {
          loadingData.value = false;
        })
      };

      onMounted(()=>{
        getInfoCategory();
        getList();
      });

      return{
        //ref
        category_value,
        date_value,
        search_key,
        search_keyWork,
        dialog_info,
        total,
        loadingData,
        deleteInfoId,
        //reactive
        options,
        search_option,
        table_data,
        operateType,
        page,
        //methods
        handleSizeChange,
        handleCurrentChange,
        toCategory,
        toDate,
        handleSelectionChange,
        addItem,
        editItem,
        editDetail,
        deleteItem,
        deleteAll,
        getList
        /*closeDialog*/
      }
    }
  }
</script>

<style lang="scss" scoped>
.label-wrap{
  &.category{
    @include labelDom(left,60,40)
  }
  &.date{
    @include labelDom(right,93,40,10)
  }
  &.key-word{
    @include labelDom(right,99,40,10)
  }
}
</style>