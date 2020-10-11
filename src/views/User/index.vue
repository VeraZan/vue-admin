<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="5">
        <div class="label-wrap key-word">
          <label>关键字：</label>
          <div class="wrap-content">
            <el-select v-model="data.search_key" placeholder="请选择">
              <el-option
                  v-for="item in data.option"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
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
        <el-button type="danger" size="medium" class="pull-right" style="width: 100%" @click="">添加用户</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { reactive } from "@vue/composition-api";
  export default {
    name: "UserIndex",
    setup(props,{ root }){
      const data = reactive({
        search_key:"",
        search_keyWork:"",
        option:[
          {value:"username",label:"邮箱"},
          {value:"truename",label:"姓名"},
          {value:"phone",label:"手机号"}
        ]
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