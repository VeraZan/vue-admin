<template>
  <el-upload
      class="avatar-uploader"
      :action="config.action"
      :data="data.uploadKey"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
    <img v-if="data.image" :src="data.image" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
  import { reactive,onMounted,watch } from "@vue/composition-api";
  import { QiniuToKen } from "@/api/common";
  export default {
    name: "UploadImg",
    props:{
      imgUrl:{
        type:String,
        default:""
      },
      config:{
        type:Object,
        default:() => {}
      }
    },
    setup(props,{ root,emit }){
      const data = reactive({
        uploadKey:{
          token:"",
          key:""
        },
        image:""
      });
      const handleAvatarSuccess = (res, file) => {
        let url = `${root.$store.getters["common/qiniuUrl"]}${res.key}`;
        data.image = url;
        emit("update:imgUrl",url);
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
        //文件名转码
        let suffix = file.name;
        data.uploadKey.key = encodeURI(`${suffix}`);
        return isJPG && isLt2M;
      };
      const getQiniuToKen = () => {
        let requestData={
          accesskey: props.config.accesskey,
          secretkey: props.config.secretkey,
          buckety: props.config.buckety
        };
        QiniuToKen(requestData).then(response=>{
          data.uploadKey.token = response.data.data.token;
        })
      };
      onMounted(()=>{
        getQiniuToKen();
      });
      watch(() => props.imgUrl,(value) => {
        data.image = value;
      });
      return{
        data,
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