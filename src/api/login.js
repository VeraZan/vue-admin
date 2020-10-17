import service from '@/utils/request'

//获取验证码
export function GetSms(data) {
  return service.request({
    method:"post",
    url:"/getSms/",
    data//es6写法，相当于data:data
  })
}

//注册
export function Register(data) {
  return service.request({
    method:"post",
    url:"/register/",
    data
  })
}

//登录
export function Login(data) {
  return service.request({
    method:"post",
    url:"/login/",
    data
  })
}

//登出
export function LogOut(data) {
  return service.request({
    method:"post",
    url:"/logout/",
    data
  })
}

/**
 * 获取用户角色
 */
export function getUserRole(data = {}){
  return service.request({
      method: "post",
      url: "/userRole/",
      data
  })
}
