<template>
  <div>
    <!--表单-->
    <el-row :gutter="16">
      <el-col :span="4">
        <div class="label-wrap category">
          <label>类型：</label>
          <div class="wrap-content">
            <el-select v-model="category_value" placeholder="请选择">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
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
                type="daterange"
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
        <el-button type="danger" size="medium" style="width: 100%">搜索</el-button>
      </el-col>
      <el-col :span="2" :offset="2">
        <el-button type="danger" size="medium" class="pull-right" style="width: 100%" @click="dialog_info = true">新增</el-button>
      </el-col>
    </el-row>
    <!--表格-->
    <div class="black-space-30"></div>
    <el-table :data="table_data" border style="width: 100%">
      <el-table-column type="selection" fixed="left" width="45"></el-table-column>
      <el-table-column prop="title" label="标题" width="830"></el-table-column>
      <el-table-column prop="category" label="类型" width="130"></el-table-column>
      <el-table-column prop="date" label="日期" width="237"></el-table-column>
      <el-table-column prop="user" label="管理员" width="115"></el-table-column>
      <el-table-column label="操作" fixed="right" width="250">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteItem">删除</el-button>
          <el-button type="success" size="mini" @click="dialog_info = true">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--底部分页-->
    <div class="black-space-30"></div>
    <el-row>
      <el-col :span="12">
        <el-button size="medium" @click="deleteAll">批量删除</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next,jumper"
            :total="1000"
            class="pull-right">
        </el-pagination>
      </el-col>
    </el-row>
    <DialogInfo :flag.sync="dialog_info"/> <!--@close="closeDialog"-->
  </div>
</template>

<script>
  import DialogInfo from "./dialog/info";
  import { global } from "@/utils/global";
  import { reactive,ref } from "@vue/composition-api";
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
      //reactive
      const options=reactive([{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }]);
      const search_option=reactive([
        { value: "id", label: "ID"},
        { value: "title", label: "标题"},
      ]);
      const table_data = reactive([
        {
          title: '默认情况下，Table 组件是不具有竖直方向的边框的，如果需要，可以使用border属性',
          category: '类型示例',
          date: '2020-01-28',
          user: 'admin'
        }
      ]);
      //methods
      const handleSizeChange = (val) => {
        console.log(`每页 ${val} 条`);
      };
      const handleCurrentChange = (val) => {
        console.log(`当前页: ${val}`);
      };
      const { confirm } = global();//confirm如果写为confirm:abc,相当于把confirm重命名为abc，调用时写abc即可
      const deleteItem = (() => {
        confirm({
          content:"确认删除此条信息？确认后将无法恢复！",
          fn:confirmDelete,
          id:"111"
        })
      });
      const deleteAll = (() => {
        confirm({
          content:"确认删除选中信息？确认后将无法恢复！",
          fn:confirmDelete,
          id:"111"
        })
      });
      const confirmDelete = ((id) => {
        console.log(id);
      });
      /*const closeDialog = (val) =>{
        dialog_info.value = val;
      };*/

      return{
        //ref
        category_value,
        date_value,
        search_key,
        search_keyWork,
        dialog_info,
        //reactive
        options,
        search_option,
        table_data,
        //methods
        handleSizeChange,
        handleCurrentChange,
        deleteItem,
        deleteAll,
        confirm
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