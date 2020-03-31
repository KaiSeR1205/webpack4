<template>
    <basci-grid
      ref="basciGrid"
      :config="grid"
      :pagination="pagination"
      @sort-change="loadData"
      @current-change="loadData"
      @row-dbclick="rowDbClick"
    >
    <!-- <template slot-scope="scope" slot="xx"><el-button @click="slotButton_click(scope)">xx</el-button></template> -->
    </basci-grid>  
</template>

<script>

import "css/basci-grid.css";
import PerfectScrollbar from 'perfect-scrollbar'
import basciGrid from "@/basci-grid.vue";
var self = {};
export default {
  name: "grid",
  components: {
    basciGrid,PerfectScrollbar

  },
  data: function() {
    return {
      xx:'公司',
      grid: {
        height: "90%",
        defaultSort: { prop: "date", order: "descending" },
        columns: [
          {
            prop: "date",
            label: "时间",
            align: "center",
            width: "100",
            sortable: "custom"
          },
          {
            prop: "desc",
            label: "描述",
            align: "center",
            sortable: "custom"
          }
        ],
        /*表格数据*/
        data: []
      },
      pagination: {
        currentPage: 1,
        pageSize: 20,
        layout: "prev, slot, next",
      }
    };
  },
  methods: {  
    // slotButton_click:function(scope){
    //   console.log(scope)
    // },
    //获取数据的方法里面可以是一个请求
    loadData: function(gridConfig, pageConfig) {
      console.log("当前页:", pageConfig.currentPage);
      console.log("排序字段:", gridConfig.sort.column);
      console.log("排序order:", gridConfig.sort.order);
      setTimeout(function() {
        gridConfig.data = [];
        if (pageConfig.currentPage < 90) {
          for (var i = 0; i < pageConfig.currentPage; i++) {
            gridConfig.data.push({
              id: i,
              date: "2020-04",
              desc: "那就看你就看就看就看" + i,
              qu:"大伤脑筋健康的数据库",
              address:"迦南科技电视剧的时间里"
            });
          }
          self.$nextTick(function() {
            gridConfig.data = gridConfig.data.sort(function(a, b) {
              return a.id - b.id;
            });
          });
        }
      }, 2000);
    },
    //行记录双击事件
    rowDbClick: function(row, column, event) {
      alert(JSON.stringify(row));
    }
  },
  beforeCreate() {
    window.vm = this
    self = this;
  },
  mounted: function() {
    
   
    this.grid.data.push({
      id: 0,
      date: "2020-04",
      desc: "那就看你就看就看就看0"
    });

      window.p = require('perfect-scrollbar').default

  }
};
</script>

<style>
.el-table__body-wrapper{
  position: relative;
  overflow: hidden;
}
</style>