<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li v-for="(val,index) in menuTab.desc" :key="index" :class="{'current':isActive === index}" @click="toggleMenu(index)">{{val}}</li>
      </ul>
      <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" class="login-form" size="medium">
        <el-form-item prop="username" class="item-form"><!--此处el-form-item直接用label属性设置label的话，label在<style scoped>中的样式修改可能不生效-->
          <label for="username">邮箱</label><!--点击label,id值与其for属性的值相同的input会获得焦点-->
          <el-input id="username" type="text" v-model="loginForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="item-form">
          <label for="password">密码</label>
          <el-input id="password" type="password" v-model="loginForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="passwords" class="item-form" v-if="isActive === 1"><!--这里如果用v-show记得验证重复密码那里判断下如果处于登录而非注册状态，直接callback(),否则表单验证通不过-->
          <label for="passwords">重复密码</label>
          <el-input id="passwords" type="password" v-model="loginForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="code" class="item-form">
          <label for="code">验证码</label>
          <el-row :gutter="20">
            <el-col :span="15">
              <el-input id="code" v-model="loginForm.code" minlength="6" maxlength="6"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button type="success" class="block" @click="getSms()" :disabled="codeBtn.status">{{ codeBtn.text }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submitForm('loginForm')" class="login-btn block" :disabled="loginBtnStatus">
            {{ isActive === 0 ? "登录":"注册" }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import sha1 from 'js-sha1';
  import { GetSms,Register,Login } from '@/api/login'
  import { reactive,ref,onMounted, onUnmounted } from '@vue/composition-api'
  //打开vue.config.js，@代指什么看configureWebpack alias，不用写.js后缀看configureWebpack extensions
  import { stripscript,validateEmail,validatePwd,validateVCode } from '@/utils/validate'

  export default {
    name: "Login",
    //下面是vue3.0新特性语法的写法（只用到一部分）
    setup(props,{ refs,root }){
      /*
       setup(props, context) {
          context.attrs --- this.$attrs
          context.slots --- this.$slots
          context.parent --- this.$parent
          context.root --- this
          context.emit --- this.$emit
          context.refs --- this.$refs
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
        loginForm.password = stripscript(value);//个人感觉此处不合理，应该直接限制特殊字符，而不是代替用户剔除
        value = loginForm.password;
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
        loginForm.passwords = stripscript(value);
        value = loginForm.passwords;
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== loginForm.password) {
          callback(new Error('重复密码不正确'));
        } else {
          callback();
        }
      };
      //验证验证码
      let validateCode = (rule, value, callback) => {
        //过滤掉特殊字符
        loginForm.code = stripscript(value);
        value = loginForm.code;
        if (value === '') {
          callback(new Error('请输入验证码'));
        } else if (!validateVCode(value)) {
          callback(new Error('验证码格式有误'));
        } else {
          callback();
        }
      };

      //这里放置data数据，生命周期，自定义的函数

      /************************数据******************************/
      const menuTab=reactive({
        desc: ['登录', '注册']
      });
      const isActive=ref(0);
      const loginBtnStatus = ref(true);
      const codeBtn = reactive({
        status:false,
        text:"获取验证码"
      });
      const timer = ref(null);
      const loginForm=reactive({
        username: '160045@qq.com',
        password: '123456789zyf',
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
      /************************方法，不要在一个方法里做多件事情******************************/
      //声明函数
      const toggleMenu = (index => {
        isActive.value = index;
        resetFormData();
        clearCountDown();
      });
      //清除表单
      const resetFormData = (() => {
        //resetFields	对整个表单进行重置，将所有字段值重置为初始值并移除校验结果，详见element的Form Methods
        refs['loginForm'].resetFields();
      });
      //更新按钮状态
      const updateBtnStatus = ((params) => {
        codeBtn.status = params.status;
        codeBtn.text = params.text;
      });
      //获取验证码
      const getSms = (() => {
        if(loginForm.username === ""){
          root.$message.error("邮箱不能为空！");
          return false;
        }
        if(!validateEmail(loginForm.username)){
          root.$message.error("邮箱格式有误，请重新输入！");
          return false;
        }
        let requestData = {
          username:loginForm.username,
          module:isActive.value===0?"login":"register"
        };
        //获取验证码按钮禁用状态置为true
        updateBtnStatus({
          status:true,
          text:"发送中"
        });

        GetSms(requestData).then(response => {
          root.$message({
            message: response.data.message,
            type: 'success'
          });
          //登录|注册按钮禁用状态为false
          loginBtnStatus.value = false;
          countDown(60);
        }).catch(error => {//Promise.reject的内容来到这里
          loginBtnStatus.value = true;
          updateBtnStatus({
            status:false,
            text:"重新获取"
          });
        })
      });
      //提交表单
      const submitForm = (formName => {
        refs[formName].validate((valid) => {
          if (valid) {
            let requestData={
              username: loginForm.username,
              password: sha1(loginForm.password),//加密
              code: loginForm.code
            };
            isActive.value === 0 ? login(requestData) : register(requestData);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      });
      //登录
      const login = ((requestData) => {
        root.$store.dispatch('app/login',requestData).then(response => {
          root.$message({
            message: response.data.message,
            type: 'success'
          });
          root.$router.push({
            name:"Console"
          })
        }).catch(error => {

        })
      });
      //注册
      const register = ((requestData) => {
        Register(requestData).then(response => {
          root.$message({
            message: response.data.message,
            type: 'success'
          });
          toggleMenu(0);
        }).catch(error => {

        })
      });
      //倒计时
      const countDown = ((number) => {
        //如果定时器存在，将其清除
        if(timer.value){
          clearInterval(timer.value);
        }
        let time = number;
        timer.value = setInterval(()=>{
          time--;
          if(time === 0){
            clearInterval(timer.value);
            updateBtnStatus({
              status:false,
              text:"再次获取"
            });
          }else{
            codeBtn.text = `倒计时${time}秒`;
          }
        },1000)
      });
      //清除倒计时
      const clearCountDown = (() => {
        updateBtnStatus({
          status:false,
          text:"获取验证码"
        });
        clearInterval(timer.value);
      });
      /************************生命周期******************************/
      //销毁页面
      onUnmounted(()=>{
        clearInterval(timer.value);
      });

      //data数据：要return
      //方法：通过页面调用的方法要return,只在方法里调用的方法不用return
      return{
        menuTab,
        isActive,
        loginBtnStatus,
        codeBtn,
        timer,
        loginForm,
        rules,
        toggleMenu,
        getSms,
        submitForm,
        login,
        register
      }
    }
  }
</script>

<style lang="scss" scoped>
  #login{
    height:100vh;
    background-color: $secondColor;
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
