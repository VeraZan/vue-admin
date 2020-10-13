let paginationHook = {
  data(){
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 50, 100]
    }
  },
  methods:{
    //改变每页显示条数
    handleSizeChange(val){
      this.tableConfig.requestData.data.pageSize = val;
      this.tableLoadData();
    },
    //改变页码
    handleCurrentChange(val){
      this.tableConfig.requestData.data.pageNumber = val;
      this.tableLoadData();
    }
  } 
}
export default paginationHook;
