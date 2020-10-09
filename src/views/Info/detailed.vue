<template>
  <el-form :model="form"  :rules="data.rules" ref="detailForm" label-width="120px">
    <el-form-item label="信息分类：" prop="categoryId">
      <el-select v-model="form.categoryId" placeholder="请选择">
        <el-option v-for="item in data.category" :key="item.id" :label="item.category_name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="新闻标题：" prop="title">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="缩略图：" prop="imgUrl">

    </el-form-item>
    <el-form-item label="发布日期：" prop="createDate">
      <el-date-picker v-model="form.createDate" type="date" placeholder="选择日期" :editable="false"></el-date-picker>
    </el-form-item>
    <el-form-item label="详细内容：" prop="content">
      <quill-editor ref="myTextEditor" v-model="form.content" :options="data.editorOption"></quill-editor>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="data.submitLoading" @click="submit('detailForm')">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { GetList,EditInfo } from "@/api/news";
  import { timestampToTime } from "@/utils/common";
  import { reactive,onMounted } from "@vue/composition-api";
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  import { quillEditor } from 'vue-quill-editor';

  export default {
    name: "infoDetailed",
    components: {
      quillEditor
    },
    setup(props,{ root,refs }){
      const data = reactive({
        id:root.$route.params.id,
        category:[],
        editorOption:{

        },
        submitLoading:false,
        rules:{
          categoryId: [
            {required: true, message: '请选择类型', trigger: 'change'}
          ],
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入概况', trigger: 'blur'}
          ]
        }
      });
      const form = reactive({
        categoryId:'',
        title:'',
        createDate:'',
        content:''
      });
      //获取分类
      const getInfoCategory = () => {
        root.$store.dispatch("common/getInfoCategory").then(response=>{
          data.category = response.data.data.data;
        });
      };
      //获取当前id信息
      const getInfo = () => {
        let requestData = {
          pageNumber:1,
          pageSize:1,
          id:data.id
        };
        GetList(requestData).then(response => {
          let data = response.data.data.data[0];
          for(let key in data){
            //没有hasOwnProperty验证编辑器会警告：
            //Possible iteration over unexpected (custom / inherited) members, probably missing hasOwnProperty check
            if(data.hasOwnProperty(key)) {
              form[key] = key !== "createDate" ? data[key] : timestampToTime(data[key]);
            }
          }
        })
      };
      const submit = (formName) => {
        refs[formName].validate((valid) => {
          if (valid) {
            let requestData = {
              id: data.id,
              categoryId: form.categoryId,
              title: form.title,
              content: form.content
            };
            data.submitLoading = true;
            EditInfo(requestData).then(response => {
              root.$message.success(response.data.message);
              data.submitLoading = false;
            }).catch(error => {
              data.submitLoading = false;
            })
          }
        })
      };
      onMounted(()=>{
        getInfoCategory();
        getInfo();
      });
      return{
        data,
        form,
        submit
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>