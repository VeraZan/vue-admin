import { GetCategory, GetCategoryAll } from "@/api/news";
import { reactive } from "@vue/composition-api";
import service from '@/utils/request';

export function common(){

  const categoryItem = reactive({
    item: []
  });

  /**
   * 获取分类
   */
  const getInfoCategory = () => {
    GetCategory().then(response => {
      categoryItem.item = response.data.data.data
    }).catch(error => {})
  };

  /**
   * 获取全部分类
   */
  const getInfoCategoryAll = () => {
    GetCategoryAll().then(response => {
      categoryItem.item = response.data.data
    }).catch(error => {})
  };

  return{
    categoryItem,
    getInfoCategory,
    getInfoCategoryAll
  }
}
//七牛云token
export  function QiniuToKen(data) {
  return service.request({
    method:"post",
    url:"/uploadImgToken/",
    data
  })
}
//获取表格数据
export function loadTableData(params) {
  return service.request({
    method:params.method || "post",
    url:params.url,
    data:params.data || {}
  })
}
