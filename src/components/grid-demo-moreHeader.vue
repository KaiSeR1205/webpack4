<template>
<div>
  <H1 style="text-align:center">table-moreHeader</H1>
  <el-table
    :data="tableData"
    :headerCellStyle='{background: "#198FFF",color: "#fff",fontWeight: "400"}'
    highlight-current-row
    border
    ref="moreHead"
    style="width: 100%">
    <el-table-column
      prop="date"
      label="日期"
      width="150">
    </el-table-column>
    <el-table-column label="三方代理分配人均">
      <el-table-column
        prop="name"
        label="最高">
      </el-table-column>
        <el-table-column
          prop="province"
          label="最低">
        </el-table-column>
      </el-table-column>
    <el-table-column label="财富分配人均">
      <el-table-column
        prop="city"
        label="最高">
      </el-table-column>
        <el-table-column
        :resizable="false"
          prop="address"
          label="最低">
        </el-table-column>
    </el-table-column>
  </el-table>
    <el-pagination
      ref="pagination"
      background
      :current-page.sync="pagination.currentPage"
      :page-size="pagination.pageSize"
      layout="prev, pager, next, jumper"
      :total="pagination.total"
      :style="{ textAlign: 'center', marginTop: '10px' }"
    ></el-pagination>
</div>
</template>

<script>
import "css/basci-grid.css";
  export default {
      name: 'grid-demo-moreHeader',
    data() {
      return {
        pagination:{
          ref:"pagination",
          currentPage:1,
          pageSize:20,
          total:1000
        },
        tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-08',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-06',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-07',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }]
      }
    },
    methods:{
          headerColumsRepair: function() {
            debugger;
            var el = this.$refs.moreHead.$el;
            var headColums = el.getElementsByClassName("is-leaf");
            if (headColums.length > 0) {
              var lastColum = headColums[headColums.length - 1];
              lastColum.style.borderRight = "none";
              var gutter = el.getElementsByClassName("gutter");
              if (
                gutter.length > 0 
              ) {
                gutter[0].style.backgroundColor = '#198FFF';
              }
            }

            var tableHeader = this.$refs.moreHead.$refs.tableHeader;
            var handleMouseDown = tableHeader.handleMouseDown;
            tableHeader.handleMouseDown = function(e, t) {
              if (!t.resizable) {
                return false;
              } else {
                handleMouseDown.call(this, e, t);
              }
            };
          }
    },
    mounted(){
      this.headerColumsRepair()
    }
  }
</script>
