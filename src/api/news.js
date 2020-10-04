import service from '@/utils/request';

//添加一级分类
export function AddFirstCategory(data) {
  return service.request({
    method:"post",
    url:"/news/addFirstCategory/",
    data//es6写法，相当于data:data
  })
}
//添加子级分类
export function AddChildrenCategory(data){
  return service.request({
    method: "post",
    url: "/news/addChildrenCategory/",
    data
  })
}
//获取分类信息(不含子级)
export function GetCategory(data){
  return service.request({
    method: "post",
    url: "/news/getCategory/",
    data
  })
}
//获取分类信息
export function GetCategoryAll(data) {
  return service.request({
    method:"post",
    url:"/news/getCategoryAll/",
    data//es6写法，相当于data:data
  })
}

//删除分类
export function DeleteCategory(data) {
  return service.request({
    method:"post",
    url:"/news/deleteCategory/",
    data//es6写法，相当于data:data
  })
}

//编辑分类
export function EditCategory(data){
  return service.request({
    method: "post",
    url: "/news/editCategory/",
    data
  })
}