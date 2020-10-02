<template>
  <div>
    <el-button type="danger">添加一级分类</el-button>
    <div>
      <el-row :gutter="30">
        <el-col :span="8">
          <div class="category-wrap">
            <div class="category">
              <h4>
                <svg-icon icon-class="minus"></svg-icon>
                标题
              </h4>
              <ul>
                <li>子级</li>
              </ul>
            </div>
            <div class="category">
              <h4>
                <svg-icon icon-class="minus"></svg-icon>
                标题
              </h4>
              <ul>
                <li>子级</li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span="16"></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: "InfoCategory"
  }
</script>

<style lang="scss" scoped>
  .category-wrap {
    div:first-child {
      &:before { top: 20px; }
    }
    div:last-child {
      &:before { bottom: 21px; }
    }
  }
  .category {
    position: relative;
    line-height: 44px;
    cursor: pointer;
    &:before {
      content: '';
      position: absolute;
      left: 22px;
      top: 0;
      bottom: 0;
      width: 32px;
      border-left: 1px dashed #000;
    }
    h4 {
      position: relative;
      padding-left: 40px;
    }
    svg {
      position: absolute;
      left: 14px;
      top: 15px;
      background-color: #fff;
      font-size: 17px;
    }
    li {
      position: relative;
      padding-left: 36px;
      margin-left: 24px;
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 22px;
        width: 32px;
        border-bottom: 1px dashed #000;
      }
    }
    li, h4 {
      @include webkit(transition, all .5s ease 0s);
      &:hover {
        background-color: #f3f3f3;
        .button-group { display: block; }
      }
    }
  }
</style>