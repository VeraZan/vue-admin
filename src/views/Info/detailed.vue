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
        <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
            <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
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
  import { QiniuToKen } from "@/api/common";
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
        uploadKey:{
          token:""
        },
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
        content:'',
        imgUrl:""
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
              content: form.content,
              imgUrl: form.imgUrl
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
      const handleAvatarSuccess = (res, file) => {
        form.imgUrl = URL.createObjectURL(file.raw);
      };
      const beforeAvatarUpload = (file) => {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          root.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          root.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      };
      const getQiniuToKen = () => {
        let requestData={
          accesskey: "Avh-EZZAa4TxqPQZsEW42fXBUbTMFi-RKSZTRKJj",
          secretkey: "l9AXtnhCVkZexXNRcmHXzmecXiCUiLynwGboMeUw",
          buckety: "webjshtml"
        };
        QiniuToKen(requestData).then(response=>{
            data.uploadKey.token = response.data.data.token;
        })
      };
      onMounted(()=>{
        getInfoCategory();
        getInfo();
        getQiniuToKen();
      });
      return{
        data,
        form,
        submit,
        handleAvatarSuccess,
        beforeAvatarUpload
      }
    }
  }
</script>

<style lang="scss">
    .avatar-uploader{
        .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            &:hover {
                border-color: #409EFF;
            }
        }
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
