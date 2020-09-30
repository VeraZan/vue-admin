<template>
  <div id="layout" :class="[menuStatus ? 'close' : 'open']">
    <LayoutHeader></LayoutHeader>
    <LayoutNav></LayoutNav>
    <layoutMain></layoutMain>
  </div>
</template>

<script>
  import LayoutHeader from './Components/Header'
  import LayoutMain from './Components/Main'
  import LayoutNav from './Components/Nav'
  import { computed } from '@vue/composition-api'
  export default {
    name: "Layout",
    components:{LayoutHeader,LayoutMain,LayoutNav},
    setup(props,{ root }){
      const menuStatus = computed(() => root.$store.state.app.isCollapse);

      return{
        menuStatus
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>