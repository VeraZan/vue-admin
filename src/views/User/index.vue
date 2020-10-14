<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="20">
        <div class="label-wrap">
          <label>关键字：</label>
          <div class="warp-content">
            <el-row :gutter="16">
              <el-col :span="3">
                <SelectVue :config="data.configOption" :selectData.sync="data.selectData" />
              </el-col>
              <el-col :span="5">
                <el-input v-model="data.key_word" placeholder="请输入搜索的关键字"></el-input>
              </el-col>
              <el-col :span="7">
                <el-button type="danger" @click="search" size="medium">搜索</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button type="danger" class="pull-right"  size="medium" @click="handlerAdd">添加用户</el-button>
      </el-col>
    </el-row>
    <div class="black-space-30"></div>
    <TableVue ref="userTable" :config="data.configTable" :tableRow.sync="data.tableRow">
      <template v-slot:status="slotData">
         <el-switch 
          @change="handlerSwitch(slotData.rowData)" 
          v-model="slotData.rowData.status" 
          active-value="2"  
          inactive-value="1"
          active-color="#13ce66" 
          inactive-color="#ff4949">
        </el-switch> 
      </template>
      <template v-slot:operation="slotData">
        <el-button type="danger" size="mini" @click="handlerDel(slotData.rowData)">删除</el-button>
        <el-button type="success" size="mini" @click="handlerEdit(slotData.rowData)">编辑</el-button>
      </template>
      <template v-slot:tableFooterLeft>
        <el-button size="small" @click="handlerBatchDel()">批量删除</el-button>
      </template>
    </TableVue>
    <DialogUser :flag.sync="data.dialog_show" :editData="data.editData" @refreshTabelData="refreshData"/>
  </div>
</template>

<script>
  //组件
  import SelectVue from "@c/Select";
  import TableVue from "@c/Table";
  import DialogUser from "./dialog/user";
  //接口
  import { UserDel, UserActives } from "@/api/user";
  //公用
  import { global } from "@/utils/global";
  import { reactive,ref } from "@vue/composition-api";
  export default {
    name: "UserIndex",
    components:{ TableVue,SelectVue,DialogUser },
    setup(props,{ root,refs }){
      const { confirm } = global();
      const userTable = ref(null);
      const data = reactive({
        configOption:{
          init:["truename","phone"]
        },
        configTable:{
          selection:true,
          tHead:[
            {label:"邮箱/用户名",field:"username",width:200},
            {label:"真实姓名",field:"truename",width:150},
            {label:"手机号",field:"phone",width:150},
            {label:"地区",field:"region",width:300},
            {label:"角色",field:"role",width:150},
            {label:"禁启用状态",field:"status",columnType:"slot",slotName:"status",fixed:"right",width:150},
            {label:"操作",columnType:"slot",slotName:"operation",fixed:"right",width:200},
          ],
          requestData:{
            url:"getUserList",
            method:"post",
            data:{
              pageNumber: 1,
              pageSize: 10
            }
          },
          pagination:{
            show:true,
            layout: "total, sizes, prev, pager, next, jumper"
          }
        },
        // table选择的数据
        tableRow: {},
        // 搜索下拉框的数据
        selectData: {
          value:"truename"
        },
        // 搜索关键字
        key_word: "",
        dialog_show: false,
        editData: {},
        updateUserStatusFlag: false
      });

      /**
       * 点击搜索触发
       */
      const search = () => {
        let requestData = {
          [data.selectData.value] : data.key_word
        }
        refs.userTable.paramsLoadData(requestData);
      }
      /* 点击添加用户*/
      const handlerAdd = () => {
        data.dialog_show = true;
        // 子组件赋值
        data.editData = Object.assign({});
      }
      /* 点击编辑*/
      const handlerEdit = (params) => {
        data.dialog_show = true;
        // 子组件赋值
        data.editData = Object.assign({}, params);
      }
      //点击批量删除
      const handlerBatchDel = () => {
        let userId = data.tableRow.idItem
        if(!userId || userId.length === 0) {
          root.$message.error("请勾选需要删除的用户！！");
          return false;
        }
        confirm({
          content: "确认删除当前信息，确认后将无法恢复！！",
          tip: "警告",
          fn: userDelete
        })         
      }
      //点击删除   
      const handlerDel = (params) => {
        data.tableRow.idItem = [params.id];
        confirm({
            content: "确认删除当前信息，确认后将无法恢复！！",
            tip: "警告",
            fn: userDelete
        })
      }
      //执行删除用户
      const userDelete = () => {
        UserDel({ id: data.tableRow.idItem }).then(response => {
          // 其中一种写法
          // refs.userTable.refreshData()
          // 第二种写法
          refreshData();
        })
      }
      /**
       * 修改用户状态
       */
      const handlerSwitch = (params) => {
        if(data.updateUserStatusFlag) { return false }
        data.updateUserStatusFlag = true;
        UserActives({ id: params.id, status: params.status }).then(response => {
          root.$message.success(response.data.message);
          data.updateUserStatusFlag = !data.updateUserStatusFlag
        }).catch(error => {
          data.updateUserStatusFlag = !data.updateUserStatusFlag
        })
      }
      //更新表格数据
      const refreshData = () => {
         refs.userTable.refreshData()
      }
      return{
        data,
        handlerAdd,handlerEdit,handlerDel,handlerBatchDel,handlerSwitch,refreshData,search
      }
    }
  }
</script>

<style lang="scss" scoped>
  .label-wrap {
    @include labelDom(left, 60, 40);
  }
</style>
