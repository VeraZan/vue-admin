<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li v-for="(val,index) in menuTab" :key="index" :class="{'current':isActive === index}" @click="toggleMenu(index)">{{val}}</li>
      </ul>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="login-form" size="medium">
        <el-form-item prop="username" class="item-form"><!--此处el-form-item直接用label属性设置label的话，label在<style scoped>中的样式修改可能不生效-->
          <label>邮箱</label>
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="item-form">
          <label>密码</label>
          <el-input type="password" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="passwords" class="item-form" v-if="isActive === 1"><!--这里如果用v-show记得验证重复密码那里判断下如果处于登录而非注册状态，直接callback(),否则表单验证通不过-->
          <label>重复密码</label>
          <el-input type="password" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="code" class="item-form">
          <label>验证码</label>
          <el-row :gutter="20">
            <el-col :span="15">
              <el-input v-model.number="ruleForm.code" minlength="6" maxlength="6"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button type="success" class="block">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submitForm('ruleForm')" class="login-btn block">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { reactive,ref,onMounted } from '@vue/composition-api'
  //打开vue.config.js，@代指什么看configureWebpack alias，不用写.js后缀看configureWebpack extensions
  import { stripscript,validateEmail,validatePwd,validateVCode } from '@/utils/validate'

  export default {
    name: "Login",
    //下面是vue3.0新特性语法的写法（只用到一部分）
    setup(props,{ refs }){
      /*
       setup(props, context) {
          context.attrs
          context.slots
          context.parent
          context.root
          context.emit
          context.refs
           ………
       }

       解构示例:
      function a(){
        return {
          attrs:0,
          slots:1,
          parent:2
        }
      }
      let {attrs,slots,parent} = a();
      console.log(attrs);//控制台会打印0
      */

      //验证用户名（即邮箱）
      let validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if(!validateEmail(value)) {
          callback(new Error('用户名格式有误'));
        } else{
          callback();
        }
      };
      //验证密码
      let validatePassword = (rule, value, callback) => {
        //过滤掉特殊字符
        ruleForm.password = stripscript(value);//个人感觉此处不合理，应该直接限制特殊字符，而不是代替用户剔除
        value = ruleForm.password;
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!validatePwd(value)) {
          callback(new Error('密码为6-20位的数字+字母'));
        } else {
          callback();
        }
      };
      //验证重复密码
      let validatePasswords = (rule, value, callback) => {
        //过滤掉特殊字符
        ruleForm.passwords = stripscript(value);
        value = ruleForm.passwords;
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== ruleForm.password) {
          callback(new Error('重复密码不正确'));
        } else {
          callback();
        }
      };
      //验证验证码
      let validateCode = (rule, value, callback) => {
        //过滤掉特殊字符
        ruleForm.code = stripscript(value);
        value = ruleForm.code;
        if (value === '') {
          callback(new Error('请输入验证码'));
        } else if (!validateVCode(value)) {
          callback(new Error('验证码格式有误'));
        } else {
          callback();
        }
      };
      //这里放置data数据，生命周期，自定义的函数
      const menuTab=reactive(['登录', '注册']);
      const isActive=ref(0);
      const ruleForm=reactive({
        username: '',
        password: '',
        passwords: '',
        code: ''
      });
      const rules=reactive({
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        passwords: [
          { validator: validatePasswords, trigger: 'blur' }
        ],
        code: [
          { validator: validateCode, trigger: 'blur' }
        ]
      });

      //声明函数
      const toggleMenu = (index => {
        isActive.value = index;
        //resetFields	对整个表单进行重置，将所有字段值重置为初始值并移除校验结果，详见element的Form Methods
        refs['ruleForm'].resetFields();
      });
      const submitForm = (formName => {
        refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      });

      //挂载完成后
      onMounted(()=>{

      });

      return{
        menuTab,
        isActive,
        ruleForm,
        rules,
        toggleMenu,
        submitForm
      }
    }
  }
</script>

<style lang="scss" scoped>
  #login{
    height:100vh;
    background-color: #344a5f;
  }
  .login-wrap{
    width:330px;
    margin: auto;
  }
  .menu-tab{
    text-align: center;
    li{
      display: inline-block;
      width: 88px;
      line-height:36px;
      font-size: 14px;
      color: #fff;
      border-radius: 2px;
      cursor: pointer;
    }
  }
  .current{
    background-color: rgba(0,0,0,.1);
  }
  .login-form{
    margin-top: 20px;
    label{
      display: block;
      margin-bottom: 3px;
      font-size: 14px;
      color:#fff;
    }
    .item-form{
      margin-bottom: 13px;
    }
    .block{
      width:100%;
      display: block;
    }
    .login-btn{
      margin-top: 19px;
    }
  }
</style>