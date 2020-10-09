<template>
  <div>
    <el-button type="danger" @click="changeCategoryFormStatus({type:'category_first_add'})">添加一级分类</el-button>
    <hr class="hr-e9e9e9" />
    <div>
      <el-row :gutter="30">
        <el-col :span="8">
          <div class="category-wrap">
            <div class="category" v-for="firstItem in category.item" :key="firstItem.id">
              <!--一级-->
              <h4>
                <svg-icon icon-class="plus"></svg-icon>
                {{ firstItem.category_name }}
                <div class="button-group">
                  <el-button type="danger" size="mini" round @click="changeCategoryFormStatus({data:firstItem,type:'category_first_edit'})">编辑</el-button>
                  <el-button type="success" size="mini" round @click="changeCategoryFormStatus({data:firstItem,type:'category_children_add'})">添加子级</el-button>
                  <el-button size="mini" round @click="deleteCategoryConfirm({categoryId:firstItem.id,type:'category_first_delete'})">删除</el-button>
                </div>
              </h4>
              <!--子级-->
              <ul v-if="firstItem.children">
                <li v-for="childrenItem in firstItem.children" :key="childrenItem.id">
                  {{ childrenItem.category_name }}
                  <div class="button-group">
                    <el-button type="danger" size="mini" round @click="changeCategoryFormStatus({data:childrenItem,pData:firstItem,type:'category_children_edit'})">编辑</el-button>
                    <el-button size="mini" round @click="deleteCategoryConfirm({categoryId:childrenItem.id,pId:firstItem.id,type:'category_children_delete'})">删除</el-button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <h4 class="menu-title">{{ category_form_title }}</h4>
          <el-form label-width="142px" class="from-wrap" :model="form" ref="categoryForm">
            <el-form-item label="一级分类名称：" prop="categoryName" v-if="category_first_input">
              <el-input v-model="form.categoryName" :disabled="category_first_disabled"></el-input>
            </el-form-item>
            <el-form-item label="二级分类名称：" prop="secCategoryName" v-if="category_children_input">
              <el-input v-model="form.secCategoryName" :disabled="category_children_disabled"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="submit" :loading="submit_button_loading" :disabled="submit_button_disabled">确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { ref,reactive,onMounted,watch } from "@vue/composition-api";
  import { AddFirstCategory,AddChildrenCategory,DeleteCategory,EditCategory } from "@/api/news";
  import { global } from "@/utils/global";
  import { common } from "@/api/common";
  export default {
    name: "InfoCategory",
    setup(props,{ root,refs }){
      //global
      const { confirm } = global();
      const { getInfoCategoryAll, categoryItem } = common();

      //ref
      const category_first_input=ref(true);
      const category_first_disabled=ref(true);
      const category_children_input=ref(true);
      const category_children_disabled=ref(true);
      const submit_button_loading=ref(false);
      const submit_button_disabled=ref(true);
      const submit_button_type=ref("");
      const category_form_title=ref("一级分类编辑");
      //reactive
      const form = reactive({
        categoryName: '',
        secCategoryName: ''
      });
      const category = reactive({
        item:[],
        current:{}
      });

      //methods
      const submit = () => {
        if(submit_button_type.value === "category_first_add"){
          addFirstCategory();
        }
        if(submit_button_type.value === 'category_first_edit') {
          editFirstCategory();
        }
        if(submit_button_type.value === 'category_children_add') {
          addChildrenCategory();
        }
        if(submit_button_type.value === 'category_children_edit') {
          editChildrenCategory();
        }
      };
      //添加一级分类
      const addFirstCategory = () => {
        if(!form.categoryName){
          root.$message.error("分类名称不能为空！");
          return false;
        }
        submit_button_loading.value = true;
        AddFirstCategory({categoryName:form.categoryName}).then(response => {
          //console.log(response.data.data);
          root.$message.success(response.data.message);
          category.item.push(response.data.data);
          resetFormAndBtn();
        }).catch(error => {
          submit_button_loading.value = false;
        })
      };
      //编辑一级分类
      const editFirstCategory = () => {
        if(Object.keys(category.current).length === 0) {
          root.$message.error("未选择分类！");
          return false;
        }
        if(!form.categoryName){
          root.$message.error("分类名称不能为空！");
          return false;
        }
        submit_button_loading.value = true;
        let requestData = {
          id: category.current.id,
          categoryName: form.categoryName
        };
        EditCategory(requestData).then(response => {
          let responseData = response.data;
          root.$message.success(responseData.message);
          let index = category.item.findIndex(item => item.id === category.current.id);
          category.item[index].category_name = form.categoryName;
          resetFormAndBtn();
        }).catch(error => {
          submit_button_loading.value = false;
        })
      };
      //添加子级分类
      const addChildrenCategory = () => {
        if(Object.keys(category.current).length === 0) {
          root.$message.error("未选择一级分类！");
          return false;
        }
        if(!form.secCategoryName){
          root.$message.error("分类名称不能为空！");
          return false;
        }
        submit_button_loading.value = true;
        let requestData = {
          categoryName: form.secCategoryName,
          parentId: category.current.id
        };
        AddChildrenCategory(requestData).then(response => {
          let responseData = response.data;
          root.$message.success(responseData.message);
          let index = category.item.findIndex(item => item.id === category.current.id);
          if(!category.item[index].children){
            category.item[index].children = [];
          }
          category.item[index].children.push(responseData.data);
          resetFormAndBtn();
        }).catch(error => {
          submit_button_loading.value = false;
        })
      };
      //编辑二级分类
      const editChildrenCategory = () => {
        if(Object.keys(category.current).length === 0) {
          root.$message.error("未选择分类！");
          return false;
        }
        if(!form.secCategoryName){
          root.$message.error("分类名称不能为空！");
          return false;
        }
        submit_button_loading.value = true;
        let requestData = {
          id: category.current.id,
          categoryName: form.secCategoryName
        };
        EditCategory(requestData).then(response => {
          let responseData = response.data;
          root.$message.success(responseData.message);
          let index = category.item.findIndex(item => item.id === category.current.pId);
          let childrenIndex = category.item[index].children.findIndex(item => item.id === category.current.id);
          category.item[index].children[childrenIndex].category_name = form.secCategoryName;
          resetFormAndBtn();
        }).catch(error => {
          submit_button_loading.value = false;
        })
      };
      //重置
      const resetFormAndBtn = () => {
        submit_button_loading.value = false;
        refs['categoryForm'].resetFields();
        category_first_disabled.value = true;
        category_children_disabled.value = true;
        submit_button_disabled.value = true;
        category.current = {};
      };
      //根据传递参数的不同调整表单项状态和值
      const changeCategoryFormStatus = (params) => {
        submit_button_type.value = params.type;
        submit_button_disabled.value = false;
        if(params.type === "category_first_add" || params.type === "category_first_edit"){
          category_form_title.value = "一级分类编辑";
          category_first_input.value = true;
          category_first_disabled.value = false;
          category_children_input.value = false;
          if(params.type === "category_first_add"){
            category.current = {};
            form.categoryName = "";
          }else{
            // current存储待编辑的一级分类的数据
            category.current = params.data;
            form.categoryName = params.data.category_name
          }
        }else if(params.type === "category_children_add" || params.type === "category_children_edit"){
          category_form_title.value = "二级分类编辑";
          category_first_input.value = true;
          category_first_disabled.value = true;
          category_children_input.value = true;
          category_children_disabled.value = false;
          // current存储数据，
          // type="category_children_add"时存的是要添加子级的一级分类的数据，
          // type="category_children_edit"时存的是待编辑的子级分类的数据
          category.current = params.data;
          if(params.type === "category_children_add"){
            form.categoryName = params.data.category_name;
            form.secCategoryName = "";
          }else{
            form.categoryName = params.pData.category_name;
            form.secCategoryName = params.data.category_name;
            category.current.pId = params.pData.id;
          }
        }
      };
      //删除确认
      const deleteCategoryConfirm = (params) => {
        confirm({
          content:"确认删除此分类？确认后将无法恢复！",
          tip:"警告",
          fn:deleteCategory,
          data:params
        });
      };
      //执行删除操作
      const deleteCategory = ((params) => {
        DeleteCategory({categoryId:params.categoryId}).then(response=>{
          root.$message.success(response.data.message);
          if(params.type === "category_first_delete"){
            /**方式一**/
            let index = category.item.findIndex(item => item.id === params.categoryId);
            //删除数组指定元素.splice(起始位置,数量,新数据);只传前两个参数用于删除，传第三个参数用于替换/插入新数据
            category.item.splice(index,1);
            /**方式二，数据量大时不建议**/
            /*let newData = category.item.filter(item => item.id != params.categoryId);
            category.item = newData;*/
          }else if(params.type === "category_children_delete"){
            let index = category.item.findIndex(item => item.id === params.pId);
            let childrenIndex = category.item[index].children.findIndex(item => item.id === params.categoryId);
            category.item[index].children.splice(childrenIndex,1);
          }
        }).catch(error=>{

        })
      });
      //挂载完成
      onMounted(() => {
        getInfoCategoryAll();
      });
      //监听categoryItem
      watch(() => categoryItem.item, (value) => {
        category.item = value;
      });

      return{
        //ref
        submit_button_loading,
        submit_button_disabled,
        submit_button_type,
        category_first_input,
        category_first_disabled,
        category_children_input,
        category_children_disabled,
        category_form_title,
        //reactive
        form,
        category,
        //methods
        submit,
        changeCategoryFormStatus,
        deleteCategoryConfirm
      }
    }
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
  .menu-title {
    line-height: 44px;
    padding-left: 22px;
    background-color: #f3f3f3;
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
      top: 14px;
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
  .button-group{
    position: absolute;
    top:-1px;
    right:10px;
    z-index:2;
    display: none;
  }
  .from-wrap {
    width: 410px;
    padding-top: 26px;
  }
  .hr-e9e9e9 {
    width: calc(100% + 60px);
    margin-left: -30px;
    border: none;
    margin-top: 30px;
    margin-bottom: 30px;
    border-bottom: 1px solid #e9e9e9;
  }
</style>