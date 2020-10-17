<template>
  <div class="page404">
    <h1>404</h1>
    <p>找不到请求的资源！</p>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.page404{ 
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1{
    font-size: 160px;
    font-weight: 600;
    color:$mainColor;
    margin-bottom: 20px;
  }
  p{
    color:$secondColor;
  }
}
</style>