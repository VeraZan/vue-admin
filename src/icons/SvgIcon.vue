<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
  import { computed } from '@vue/composition-api'
  export default {
    name:"SvgIcon",
    // props:['iconClass','className'],//简写版
    props:{
      iconClass:{
        type:String,//定义接收的值类型
        default:""//设置默认值，基础数据类型直接赋值，对象类型用函数,譬如数组用()=>[]，对象用()=>{}
        //required:true,//是否必填项
        //validator:(value)=>{}//校验
      },
      className:{
        type:String,
        default:""
      }
    },
    setup(props){

      /*computed 监听值/属性的变化并计算*/
      const iconName = computed(() => `#icon-${props.iconClass}`);
      const svgClass = computed(() => {
        if(props.className){
          return `svg-icon ${props.className}`
        }else{
          return `svg-icon`
        }
      });

      return{
        iconName,
        svgClass
      }
    }
  }
</script>
<style lang="scss" scoped>
.svg-icon{
  width: 1em;
  height: 1em;
  fill:currentColor;
  //font-size: 20px;//svg图标设置宽高后设置font-size方可生效
  //color:#fff;//svg图标设置fill:currentColor;后设置color方可生效
}
</style>