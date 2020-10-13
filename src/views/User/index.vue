<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="5">
        <div class="label-wrap key-word">
          <label>关键字：</label>
          <div class="wrap-content">
            <SelectVue :config="data.configOption"/>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <el-input v-model="data.search_keyWork" placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" size="medium" @click="" style="width: 100%">搜索</el-button>
      </el-col>
      <el-col :span="2" :offset="11">
        <el-button type="danger" size="medium" class="pull-right" style="width: 100%" @click="">新增</el-button>
      </el-col>
    </el-row>
    <div class="black-space-30"></div>
    <TableVue  :config="data.configTable">
      <template v-slot:status="slotData">
        <el-switch v-model="slotData.rowData.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </template>
      <template v-slot:operation="slotData">
        <el-button type="danger" size="mini">删除</el-button>
        <el-button type="success" size="mini">编辑</el-button>
      </template>
    </TableVue>
  </div>
</template>

<script>
  import  SelectVue from "@c/Select";
  import  TableVue from "@c/Table";
  import {  reactive  } from "@vue/composition-api";
  export default {
    name: "UserIndex",
    components:{TableVue,  SelectVue },
    setup(props,{ root }){
      const data = reactive({
        search_keyWork:"",
        configOption:{
          init:["username","truename","phone"]
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
        }
      });
      return{
        data
      }
    }
  }
</script>

<style lang="scss" scoped>
  .label-wrap{
    &.key-word{
      @include labelDom(left,70,40,0)
    }
  }
</style>
