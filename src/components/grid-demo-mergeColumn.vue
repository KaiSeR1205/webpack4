<template>
  <div>
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      :highlight-current-row="true"
      :row-class-name="tableRowClassName"
      @row-dblclick="rowDbClick"
      @row-click="rowClick"
      style="width: 100%; margin-top: 20px">
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="amount1"
        label="数值 1（元）">
      </el-table-column>
      <el-table-column
        prop="amount2"
        label="数值 2（元）">
      </el-table-column>
      <el-table-column
        prop="amount3"
        label="数值 3（元）">
      </el-table-column>
     </el-table>
  </div>
</template>

<script>
  import "css/basci-grid.css";
  export default {
    data() {
      return {
        currentRow:{},
        tableData: [{
          id: '12987122',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10,
        }, {
          id: '12987122',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12
        }, {
          id: '12987122',
          name: '王小虎',
          amount1: '324',
          amount2: '1.9',
          amount3: 9
        }, {
          id: '12987123',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 17
        }, {
          id: '12987123',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 314
        }, {
          id: '12987123',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 123
        }, {
          id: '12987124',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 34
        }, {
          id: '12987124',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 23
        }, {
          id: '12987124',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 173
        }]
      };
    },
    methods: {
      rowDbClick:function(row, column, event){
        this.$notify({
          title: '未来取得营销岗位证书',
          dangerouslyUseHTMLString: true,
          message: '你需要在6个月内取得营销岗位资格,不然很遗憾您将无法担任现岗位',
          type:'success',
          //dangerouslyUseHTMLString:true
        });                 
      },
      tableRowClassName:function(obj){
//debugger;
if(obj.row.id==this.currentRow.id){
  return 'multipleSelect'
}
      },
      rowClick:function(obj){
        debugger;
        this.currentRow = obj
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          var rowSpan = this.tableData.filter(function(o,i){return o.id==row.id}).length
          if (rowIndex % rowSpan === 0) {
            return {
              rowspan: rowSpan,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      }
    },
    mounted:function(){
      window.vm = this
    }
  }
</script>
<style>

</style>