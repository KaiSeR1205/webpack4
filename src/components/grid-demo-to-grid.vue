<template>
  <div style="height:100%">
    <basci-grid
      ref="basciGrid"
      :config="grid"
      :pagination="pagination"
      @sort-change="loadData"
      @current-change="loadData"
      @expand_change="expandChange"
      @cell-click="cellClick"
    >
      <template slot="slotColum">
        <el-table-column :width="width" type="expand" sortable>
          <template>
            <div class="grid_title">{{sub_grid.title}}</div>
            <basci-grid
              :key="sub_grid.ref"
              ref="subGrid"
              :config="sub_grid"
              :pagination="sub_pagination"
              @sort-change="subGrid_load"
            ></basci-grid>
          </template>
        </el-table-column>
        <el-table-column label="编号" width="180" align="center" prop="id" sortable>
          <template slot-scope="scope">
            <div class="content">
              <div>{{scope.row.id}}</div>
              <div v-show="scope.row.isExpand" class="selectIcon">
                <i class="el-icon-caret-top"></i>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center" prop="name" sortable>
          <template slot-scope="scope">
            <div class="content">
              <div>{{scope.row.name}}</div>
              <div v-show="scope.row.isExpand" class="selectIcon">
                <i class="el-icon-caret-top"></i>
              </div>
            </div>
          </template>
        </el-table-column>
      </template>
    </basci-grid>
  </div>
</template>
<script>
import "css/basci-grid.css";
import basciGrid from "@/basci-grid.vue";
var self = {};
export default {
  name: "grid",
  components: {
    basciGrid
  },
  data: function() {
    return {
      current: {
        row: {},
        cell: {},
        checked: false
      },
      beforeOpenRow: {
        row: {},
        cell: ""
      },
      width: "",
      id_column: {
        columns: [
          {
            prop: "id_column",
            label: "id_grid",
            align: "left",
            width: "200",
            sortable: true
          },
          {
            prop: "id_column_name",
            label: "id_grid_name",
            align: "center",
            sortable: true
          }
        ],
        defaultSort: { prop: "id_column", order: "ascending" },
        title: "subIdGrid"
      },
      name_column: {
        columns: [
          {
            prop: "name_column",
            label: "name_grid",
            width: "200",
            align: "left",
            sortable: true
          },
          {
            prop: "name_column_name",
            label: "name_grid_name",
            align: "center",
            sortable: true
          }
        ],
        defaultSort: { prop: "name_column", order: "ascending" },
        title: "subNameGrid"
      },
      sub_grid: {
        title: "",
        height: "300px",
        highlightCurrentRow: false,
        headerCellStyle: {
          background: "#E8F0FE",
          color: "#8E98AE",
          fontWeight: "400"
        },
        ref: "subGrid_ref",
        columns: [
          {
            prop: "sub_id",
            label: "sub_编号",
            sortable: true
          },
          {
            prop: "sub_name",
            label: "sub_姓名",
            sortable: true
          }
        ],
        data: []
      },
      sub_pagination: {
        show: false
      },
      grid: {
        cellClassName: function(obj) {
          return self.cellClassName(obj);
        },
        height: "90%",
        columnSlot: "slotColum",
        highlightCurrentRow: false,
        headerCellStyle: {
          background: "#E8F0FE",
          color: "#8E98AE",
          fontWeight: "400"
        },
        defaultSort: { prop: "id", order: "ascending" },
        columns: [],
        /*表格数据*/
        data: []
      },
      pagination: {
        currentPage: 1,
        pageSize: 20,
        layout: "total,  prev, pager, next, jumper",
        total: 1000
      }
    };
  },
  methods: {
    //列样式变更回调
    cellClassName: function(obj) {
      obj.row.isExpand = false;
      if (
        obj.row == this.current.row &&
        obj.column.property == this.current.cell &&
        this.current.checked
      ) {
        obj.row.isExpand = true;
        return "cellTest";
      }
    },
    //列点击
    cellClick: function(row, column, cell, event) {
      //显示el-scrollbar 竖向滚动 并且 开启滚动
      var scrollWarp =  this.$refs.basciGrid.$refs.basciTable.$refs.tableElScrollbar.wrap
      $(scrollWarp).css("overflowY",'scroll')
      $(scrollWarp).siblings('.is-vertical').show()
      //如果已有被展开行 点击其他地方则 关闭 可选
      if(this.current.checked){
        this.current.checked = false;
        this.current.row = {}
        this.current.cell=""
        this.$refs.basciGrid.$refs.basciTable.toggleRowExpansion(
          this.beforeOpenRow.row,
          false
        );
        this.beforeOpenRow = { row: {}, cell: {} };          
      } 
      //如果已有被展开行 只有点击当前行才会被关闭 子菜单 可选
      else if (
        this.current.row == row &&
        this.current.checked &&
        column.property == this.current.cell
      ) {
        this.current.checked = false;
        this.current.row = {}
        this.current.cell=""
        this.$refs.basciGrid.$refs.basciTable.toggleRowExpansion(
          this.beforeOpenRow.row,
          false
        );
        this.beforeOpenRow = { row: {}, cell: {} };
      } else {
        this.sub_grid.sort = {};
        this.current.checked = true;

        this.$nextTick(function() {
          this.showSub(row, column, cell, event);
        });
      }
      this.current.row = row;
      this.current.cell = column.property;
    },
    //显示子表格
    showSub: function(row, column, cell, event) {
      //先关闭之前展开的
      self.$refs.basciGrid.$refs.basciTable.toggleRowExpansion(
        this.beforeOpenRow.row,
        false
      );
      self.$nextTick(function() {
        //展开当前选中的
        self.$refs.basciGrid.$refs.basciTable.toggleRowExpansion(row, true);
      });
      //记录当前选中的行和列
      this.beforeOpenRow.row = row;
      this.beforeOpenRow.cell = column.property;

      this.subGrid_load(this.sub_grid, this.sub_pagination, true);

      //置顶当前选中行 隐藏el-scrollbar 竖向滚动 并且禁用 
      this.$nextTick(function() {
        var curTrDom = cell.currentTarget;
        var top = curTrDom.offsetTop;
        console.log("tagName:", curTrDom.tagName, "top:", top);
        var scrollWarp =  this.$refs.basciGrid.$refs.basciTable.$refs.tableElScrollbar.wrap
        scrollWarp.scrollTop = top;
        $(scrollWarp).css("overflowY",'hidden')
        $(scrollWarp).siblings('.is-vertical').hide()
      });
    },
    //展开事件
    expandChange: function(row, expandedRows) {
      // console.log("展开行:",row)
    },
    //子表格数据加载
    subGrid_load: function(gridConfig, pageConfig, doLayout) {
      //需要重新渲染的时候执行 否则只变更数据
      if (typeof doLayout != "undefined" && doLayout) {
        //获取subGrid配置
        var subColumn = this.current.cell + "_column";
        this.sub_grid.columns = this[subColumn].columns;
        this.sub_grid.title = this[subColumn].title;
        if (
          typeof gridConfig.sort == "undefined" ||
          typeof gridConfig.sort.column == "undefined"
        ) {
          this.sub_grid.defaultSort = this[subColumn].defaultSort;
        } else {
          this.sub_grid.defaultSort = {
            prop: gridConfig.sort.column,
            order: gridConfig.sort.order + "ending"
          };
        }
        //更改key 渲染grid
        // this.sub_grid.ref = "subGrid_ref_" + new Date().getTime()
      }

      //模拟数据（下面这里可从数据库获取数据）
      var temp_data = [];
      if (this.current.cell == "id") {
        temp_data = {
          id_column: "test_id_column",
          id_column_name: "test_id_column_name",
          isExpand: false
        };
      } else if (this.current.cell == "name") {
        temp_data = {
          name_column: "test_name_column",
          name_column_name: "test_name_column_name",
          isExpand: false
        };
      }

      this.sub_grid.data = [];
      for (var i = 0; i < self.current.row.id.split("_")[1]; i++) {
        var temp = Object.assign({}, temp_data);
        for (var item in temp) {
          temp[item] += "_" + (i + 1);
        }
        this.sub_grid.data.push(temp);
      }
    },
    //获取数据的方法里面可以是一个请求
    loadData: function(gridConfig, pageConfig) {
      console.log("当前页:", pageConfig.currentPage);
      console.log("排序字段:", gridConfig.sort.column);
      console.log("排序order:", gridConfig.sort.order);
      this.sub_grid.sort = {};
      gridConfig.data = [];
      this.$nextTick(function() {
        self.grid.showLoading(true);
        setTimeout(function() {
          if (pageConfig.currentPage < 90) {
            var id = new Date()
              .getTime()
              .toString()
              .substring(0, 5);
            for (var i = 0; i < pageConfig.currentPage; i++) {
              gridConfig.data.push({
                id: id + "_" + (i + 1),
                name: "好滋好味鸡蛋仔" + (i + 1),
                key: "key_" + (i + 1)
              });
            }
          }
        }, 2000);
      });
    }
  },
  beforeCreate: function() {
    window.vm = this;
    self = this;
  },
  mounted: function() {
    this.width = 1;
    this.$nextTick(function() {
      this.loadData(this.grid, this.pagination);
    });
  }
};
</script>

        <style>
html,
body {
  font-family: Microsoft YaHei, SimSun, Tahoma, Arial;
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding: 0;
  margin: 0;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
}

[v-cloak] {
  display: none;
}
.cellTest {
  /* background:#B1D6F0 !important; */
  border-bottom: 0px !important;
}
.grid_title {
  line-height: 40px;
  background-color: #5b97fb;
  color: #fff;
  padding-left: 10px;
}
#basciTable .el-table {
  border-left: none;
  border-top: none;
}
/* 选中时升序颜色 */
.el-table .descending .sort-caret.descending {
  border-top-color: #409eff;
}
/* 选中时降序颜色 */
.el-table .ascending .sort-caret.ascending {
  border-bottom-color: #409eff;
}
.el-table__expanded-cell[class*="cell"] {
  padding-top: 0px !important;
  padding-left: 0px !important;
  padding-right: 0px !important;
}
.selectIcon {
  position: absolute;
  align-self: center;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  bottom: -5px;
  color: #409eff;
}
.el-table__expanded-cell{
    padding-bottom: 0px !important;
}
.content {
  -ms-flex-align: center;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -ms-flex-direction: column;
  -moz-flex-direction: column;
  -webkit-flex-direction: column;
  flex-direction: column;
}
</style>