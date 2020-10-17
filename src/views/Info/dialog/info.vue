<template>
  <el-dialog :title="operateType.type === 'add' ? '新增':'修改'" :visible.sync="dialog_info_flag" width="580px" @close="close" @open="openDialog">
    <el-form :model="form" :rules="rules" ref="infoForm">
      <el-form-item label="类型：" prop="categoryId" :label-width="formLabelWidth">
        <el-select v-model="form.categoryId" placeholder="请选择">
          <el-option v-for="item in categoryOption.item" :key="item.id" :label="item.category_name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题：" prop="title" :label-width="formLabelWidth">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="概况：" prop="content" :label-width="formLabelWidth">
        <el-input v-model="form.content" type="textarea" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="danger" :loading="submitLoading" @click="submit('infoForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { AddInfo,EditInfo,GetList} from "@/api/news";
  import { reactive,ref,watchEffect } from "@vue/composition-api";
  export default {
    name: "DialogInfo",
    //父->子是单向数据流，不能反向修改（即不能直接在父组件修改）
    props:{
      flag:{
        type:Boolean,
        default:false
      },
      category:{
        type:Array,
        default: () => []
      },
      operateType:{
        type:Object,
        default: () => {}
      }
    },
    setup(props,{ emit,root,refs }){
      //ref
      const dialog_info_flag = ref(true);
      const submitLoading = ref(false);
      const formLabelWidth =  ref('70px');
      //reactive
      const form = reactive({
        categoryId: '',
        title: '',
        content: ''
      });
      const rules = reactive({
        categoryId: [
          {required: true, message: '请选择类型', trigger: 'change'}
        ],
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入概况', trigger: 'blur'}
        ]
      });
      const categoryOption = reactive({
        item:[]
      });
      //watch
      watchEffect(() => {
        dialog_info_flag.value = props.flag;
      });
      //methods
      const close = () => {
        refs['infoForm'].resetFields();
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
      };
      const openDialog = () => {
        categoryOption.item = props.category;
        if(props.operateType.type === "edit"){
          getInfo();//此处应该为根据id获取信息详情的方法，后台没有专门做此方法，暂时用获取列表的方法传参代替
        }
      };
      const getInfo = () => {
        let requestData = {
          pageNumber:1,
          pageSize:1,
          id:props.operateType.id
        };
        GetList(requestData).then(response => {
          let data = response.data.data.data[0];
          form.categoryId = data.categoryId;
          form.title = data.title;
          form.content = data.content;
        })
      };
      const submit = (formName) => {
        refs[formName].validate((valid) => {
          if (valid) {
            let requestData = {
              categoryId: form.categoryId,
              title: form.title,
              content: form.content
            };
            submitLoading.value = true;
            let submitType = AddInfo;
            if(props.operateType.type === "edit"){
              requestData.id = props.operateType.id;
              submitType = EditInfo;
            }
            submitType(requestData).then(response => {
              root.$message.success(response.data.message);
              submitLoading.value = false;
              close();
              emit('refreshList');
            }).catch(error => {
              submitLoading.value = false;
            })
          }
        })
      };
      return{
        //ref
        dialog_info_flag, formLabelWidth,submitLoading,
        //reactive
        form,rules,categoryOption,
        //methods
        close,openDialog,submit
      }
    }
  }
</script>

<style scoped>

</style>