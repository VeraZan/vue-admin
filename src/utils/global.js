import { MessageBox } from "element-ui";
export function global() {
  const confirm = (params) => {
    MessageBox.confirm(params.content, params.tip || '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: params.type || 'warning',
      center: true
    }).then(() => {//确定
      params.fn && params.fn(params.data || "");//params.fn存在的话才会走params.fn(params.id)
    }).catch(() => {//取消
      params.catchFn && params.catchFn();
    });
  };
  //调用此方法的组件可以监听return的数据的变化
  return{
    confirm
  }

}