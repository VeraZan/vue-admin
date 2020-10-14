<template>
   <el-dialog :title="editData.id ? '编辑':'新建'" :visible.sync="data.dialog_info_flag" @close="close" width="700px" @opened="openDialog">
    <el-form :model="data.form" :rules="data.rules" ref="userInfoForm">
      <el-form-item label="用户名：" :label-width="data.formLabelWidth" prop="username">
          <el-input v-model="data.form.username" placeholder="请输入邮箱" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码：" :label-width="data.formLabelWidth" prop="password">
          <el-input type="password" v-model="data.form.password" placeholder="请输入6~20数字+字母" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="姓名：" :label-width="data.formLabelWidth" prop="truename">
          <el-input v-model="data.form.truename" placeholder="请输入真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号：" :label-width="data.formLabelWidth" prop="phone">
          <el-input v-model.number="data.form.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="地区：" :label-width="data.formLabelWidth" prop="region">
        <city-picker :cityPickerData.sync="data.cityPickerData" :cityPickerLevel="data.cityPickerLevel"></city-picker>
      </el-form-item>
      <el-form-item label="是否启用：" :label-width="data.formLabelWidth" prop="status">
          <el-radio v-model="data.form.status" label="1">禁用</el-radio>
          <el-radio v-model="data.form.status" label="2">启用</el-radio>
      </el-form-item>
      <el-form-item label="角色：" :label-width="data.formLabelWidth" prop="role">
          <el-checkbox-group v-model="data.form.role">
            <el-checkbox v-for="item in data.roleItem" :key="item.role" :label="item.role">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
      </el-form-item>
      <el-form-item label="按钮：" :label-width="data.formLabelWidth">
        <template v-if="data.btnPerm.length > 0">
          <div v-for="(item,index) in data.btnPerm" :key="index">
            <h4>{{ item.name }}</h4>
            <template v-if="item.perm && item.perm.length > 0">
              <el-checkbox-group v-model="data.form.btnPerm">
                <el-checkbox v-for="buttons in item.perm" :key="buttons.value" :label="buttons.value">{{ buttons.name }}</el-checkbox>
              </el-checkbox-group>
            </template>
          </div>
        </template>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="danger" :loading="data.submitLoading" @click="submit('userInfoForm')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import sha1 from 'js-sha1';
import { reactive, watchEffect } from "@vue/composition-api";
import { GetRole, GetSystem, GetPermButton, UserAdd, UserEdit} from "@/api/user";
import { stripscript,validateEmail,validatePwd } from "@/utils/validate";//过滤
import CityPicker from "@c/CityPicker";// 组件
export default {
  name: "DialogUser",
  components: { CityPicker },
  props:{
    flag: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root,emit,refs }) {
    // 验证用户名
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (!validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback(); //true
      }
    };
    // 验证密码
    let validatePassword = (rule, value, callback) => {
      /**
       * 业务逻辑
       * 1、编辑状态：
       *    需要检验：data.form.id存在并且，密码不为空时
       *    不需要检验：data.form.id存在并且，密码为空时
       *
       * 2、添加状态
       *    需要检验：data.form.id不存在
       */
      if (data.form.id && !value) {
        callback();
      }
      if ((data.form.id && value) || !data.form.id) {
        // 过滤后的数据
        if (value) {
          data.form.password = stripscript(value);
          value = data.form.password;
        }
        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (!validatePwd(value)) {
          callback(new Error("密码为6至20位数字+字母"));
        } else {
          callback();
        }
      }
    };
    const data = reactive({
      dialog_info_flag: false, 
      cityPickerData: {},
      cityPickerLevel:["province","city","area","street"],
      formLabelWidth: "90px",
      form: {
        username: "",
        truename: "",
        password: "",
        phone: "",
        region: "",
        status: "2",
        role: [],
        btnPerm: []
      },
      rules: {
        username: [{ required: true, validator: validateUsername, trigger: "blur" }],
        password: [{ required: true, validator: validatePassword, trigger: "blur" }],
        role: [{ required: true, message: "请选择角色", trigger: "change" }]
      },
      // 角色选择
      roleItem: [],
      // 按钮权限
      btnPerm: [],
      // 按钮加载
      submitLoading: false
    });
    // watch
    watchEffect(() => (data.dialog_info_flag = props.flag));
    /*请求角色*/
    const getRole = () => {
      if(data.roleItem.length === 0) {
        GetRole().then(response => {
          data.roleItem = response.data.data
        })
      }
      if(data.btnPerm.length === 0) {
        GetPermButton().then(response => {
          data.btnPerm = response.data.data
        })
      }
    }
    /*弹窗打开，动画结束时*/
    const openDialog = () => {
      // 角色请求
      getRole();
      // 初始值处理
      let editData = props.editData;
      if (editData.id) {
        // 编辑
        editData.role = editData.role ? editData.role.split(",") : []; // 数组
        editData.btnPerm = editData.btnPerm ? editData.btnPerm.split(",") : []; // 数组
        // 循环JSON对象
        for (let key in editData) {
          data.form[key] = editData[key];
        }
        data.cityPickerData = JSON.parse(data.form.region);
      } else {
        // 添加
        data.form.id && delete data.form.id;
        resetForm();
        data.form.role = [];
        data.form.btnPerm = [];
      }
    };
    /**关闭弹窗 */
    const close = () => {
      data.dialog_info_flag = false;
      resetForm();
      emit("update:flag", false);
    };
    /**重置表单 */
    const resetForm = () => {
      data.cityPickerData = {};
      refs.userInfoForm.resetFields();
    };
    /**提交表单 */
    const submit = (formName) => {
      refs[formName].validate((valid) => {
        // 表单验证通过
        if (valid) {
          // 数据处理
          let requestData = Object.assign({}, data.form); //
          requestData.role = requestData.role.join();  // 数组转字符串，默认以，号隔开
          requestData.btnPerm = requestData.btnPerm.join();  // 数组转字符串，默认以，号隔开
          requestData.region = JSON.stringify(data.cityPickerData);
          // 添加状态：需要密码，并且加密码
          // 编辑状态：id值存在，需要密码，并且加密码；否则删除密码
          if(requestData.id) {
            if(requestData.password) {
              requestData.password = sha1(requestData.password)
            }else{
              delete requestData.password
            }
            userEdit(requestData)
          }else{
            requestData.password = sha1(requestData.password);
            userAdd(requestData)
          }
        }else {
          return false;
        }
      })
    }
    /**添加用户 */
    const userAdd = (requestData) => {
      UserAdd(requestData).then(response => {
        let data = response.data
        root.$message.success(data.message);
        close();
        emit('refreshTabelData');
      })
    }
    /**编辑用户 */
    const userEdit = (requestData) => {
      UserEdit(requestData).then(response => {
        let data = response.data
        root.$message.success(data.message);
        close();
        emit('refreshTabelData');
      })
    }
    return {
      data,
      openDialog,close,submit
    };
  }
};
</script>

<style>
</style>