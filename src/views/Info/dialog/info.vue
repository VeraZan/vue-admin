<template>
  <el-dialog title="新增" :visible.sync="dialog_info_flag" width="580px" @close="close">
    <el-form :model="form">
      <el-form-item label="类型：" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题：" :label-width="formLabelWidth">
        <el-input v-model="form.name" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="概况：" :label-width="formLabelWidth">
        <el-input v-model="form.desc" type="textarea" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="danger" @click="">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { reactive,ref,watchEffect } from "@vue/composition-api";
  export default {
    name: "DialogInfo",
    //父->子是单向数据流，不能反向修改（即不能直接在父组件修改）
    props:{
      flag:{
        type:Boolean,
        default:false
      }
    },
    setup(props,{ emit }){
      //ref
      const dialog_info_flag = ref(true);
      const formLabelWidth =  ref('70px');
      //reactive
      const form = reactive({
        name: '',
        region: '',
        desc: ''
      });
      //watch
      watchEffect(() => {
        dialog_info_flag.value = props.flag;
      });
      //methods
      const close = (() => {
        dialog_info_flag.value = false;
        //this.$emit('close',false);
        emit('update:flag',false);
        /*
        如果/src/views/Info/index.vue中<DialogInfo :flag="dialog_info">，
        :flag加了修饰器.sync，即写为:flag.sync="dialog_info"，
        此处可以直接 this.$emit('update:flag',false);
        不需要this.$emit('close',false);
        也不需要/src/views/Info/index.vue中@close="closeDialog"和closeDialog方法
        */
        //回调时需要做逻辑处理的时候，就不能用修饰器，反之可以
      });

      return{
        //ref
        dialog_info_flag,
        formLabelWidth,
        form,
        close
      }
    }
  }
</script>

<style scoped>

</style>