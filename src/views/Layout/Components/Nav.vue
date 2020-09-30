<template>
  <div id="nav-wrap">
    <h1 class="logo"><img src="../../../assets/logo.png" alt=""></h1>
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#fff"
      unique-opened
      router
    >
      <template v-for="(item,index) in routers">
        <el-submenu v-if="!item.hidden" :key="item.id" :index="item.path">
          <template slot="title">
            <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon" />
            <span slot="title">{{ item.meta.name }}</span>
          </template>
          <el-menu-item v-for="(subItem,subIndex) in item.children" :key="subItem.id" :index="subItem.path">
            {{ subItem.meta.name }}
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import { reactive,computed } from '@vue/composition-api'
  export default {
    name: "Nav",
    setup(props,{ root }){
      //const isCollapse = ref(false);
      const routers = reactive(root.$router.options.routes);

      //computed监听
      const isCollapse = computed(() => root.$store.state.app.isCollapse);

      return{
        isCollapse,
        routers
      }
    }
  }
</script>

<style lang="scss" scoped>
  .logo {
    text-align: center;
    img {
      margin: 28px auto 25px;
      width: 92px;
      @include webkit(transition, all .3s ease 0s);
    }
  }
  #nav-wrap{
    position: fixed;
    top: 0;
    left: 0;
    width: $navMenu;
    height: 100vh;
    background-color: #344a5f;
    @include webkit(transition, all .3s ease 0s);
    .el-menu{
      border-right: 0;
    }
    svg{
      font-size: 20px;
      margin-right: 10px;
    }
  }
  .open{
    #nav-wrap{
      width: $navMenu;
    }
  }
  .close{
    #nav-wrap{
      width: $navMenuMin;
    }
    .logo img{
      width: 60%;
    }
  }
</style>