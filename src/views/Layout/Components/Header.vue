<template>
  <div id="header-wrap">
    <div class="pull-left header-icon" @click="navMenuStatus">
      <svg-icon icon-class="menu" class-name="menu"></svg-icon>
    </div>
    <div class="pull-right">
      <div class="user-info pull-left">
        <img src="../../../assets/images/face.png" alt="">
        {{ username }}
      </div>
      <div class="pull-right header-icon" @click="logout">
        <svg-icon icon-class="exit" class-name="exit"></svg-icon>
      </div>
    </div>
  </div>
</template>

<script>
  import { computed } from "@vue/composition-api"
  export default {
    name: "Header",
    setup(props,{ root }){
      const username = computed(() => root.$store.state.app.username);
      const navMenuStatus = (() => {
        root.$store.commit("app/SET_COLLAPSE");
      });
      const logout = (() => {
        root.$store.dispatch("app/logout").then(() => {
          root.$message.success("退出登录成功");
          root.$router.push({
            name:"Login"
          })
        });
      });
      return{
        username,
        navMenuStatus,
        logout
      }
    }
  }
</script>

<style lang="scss" scoped>
  #header-wrap{
    position: fixed;
    top: 0;
    right: 0;
    left: $navMenu;
    height: 75px;
    line-height: 75px;
    background-color: #fff;
    @include webkit(box-shadow,0 3px 16px 0 rgba(0,0,0,.1));
    @include webkit(transition, all .3s ease 0s);
    z-index: 4;
  }
  .open{
    #header-wrap{
      left: $navMenu;
    }
  }
  .close{
    #header-wrap{
      left: $navMenuMin;
    }
  }
  @mixin headerSvg(){
    color:#555;
    cursor: pointer;
  }
  .header-icon{
    padding: 0 32px;
    svg{
      margin-bottom: -8px;
      font-size: 25px;
      @include headerSvg
    }
  }
  .user-info{
    height:100%;
    padding:0 32px;
    border-right: 1px solid #ededed;
    + .header-icon{
      padding:0 28px;
      svg{
        font-size: 22px;
        @include headerSvg
      }
    }
    img {
      width: 35px;
      height: auto;
      display: inline-block;
      margin-bottom: -12px;
      margin-right: 18px;
      border-radius: 50px;
    }
  }
</style>