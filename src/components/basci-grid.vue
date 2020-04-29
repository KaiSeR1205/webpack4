<template>
  <div class="basci-table" :id="basciConfig.ref">
    <div v-if="basciConfig.refresh.show" :class="['basci-table-refresh',basciConfig.refresh.class]" @click="refreshEvent" >
      <i :class="[basciConfig.refresh.icon?basciConfig.refresh.icon:'el-icon-refresh']"></i>
    </div>
    <el-table
      :ref="basciConfig.ref"
      :highlight-current-row="basciConfig.highlightCurrentRow"
      :row-class-name="rowClassName"
      :cell-class-name="basciConfig.cellClassName"
      :span-method="basciConfig.spanMethod"
      :size="basciConfig.size"
      :stripe="basciConfig.stripe"
      :empty-text="basciConfig.emptyText"
      :tooltip-effect="basciConfig.tooltipEffect"
      v-loading="basciConfig.loading"
      @row-dblclick="rowDbClick"
      @cell-dblclick="cellDblClick"
      @expand-change="expandChange"
      @row-click="rowClick"
      @cell-click="cellClick"
      @sort-change="sortChange"
      @select="select"
      @select-all="selectAll"
      :default-sort="basciConfig.defaultSort"
      :data="basciConfig.data"
      :sort-orders="sortOrders"
      :height="basciConfig.height"
      :max-height="basciConfig.maxHeight"
      :width="basciConfig.width"
      :border="basciConfig.border"
      :header-cell-style="basciConfig.headerCellStyle"
      :header-row-style="basciConfig.headerRowStyle"
      :style="basciConfig.style"
    >
      <slot :name="basciConfig.columnSlot"></slot>
      <el-table-column
        v-for="(item,index) in basciConfig.columns"
        :key="index"
        :type="item.type"
        :show-overflow-tooltip="typeof(item.showOverflowTooltip)=='undefined'?true:item.showOverflowTooltip"
        :prop="item.prop"
        :label="item.label"
        :resizable="typeof(item.resizable)=='undefined'?true:item.resizable"
        :align="item.align"
        :width="item.width"
        :min-width="item.minWidth"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :sort-orders="sortOrders"
        :formatter="item.formatter"
        :render-header="item.renderHeader"
      ></el-table-column>
    </el-table>
    <el-pagination
      v-if="basciPagination.show"
      :ref="basciPagination.ref"
      :background="basciPagination.background"
      :style="basciPagination.style"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :disabled="basciPagination.disabled"
      :current-page.sync="basciPagination.currentPage"
      :page-size="basciPagination.pageSize"
      :page-sizes="basciPagination.pageSizes"
      :layout="basciPagination.layout"
      :total="basciPagination.total"
    >
      <span style="position:relative">
        <span class="pagination_first">
          <el-link
            :disabled="pagination.currentPage==1"
            :underline="false"
            type="primary"
            @click="jumpFirst"
          >首页</el-link>
        </span>
        <span>
          <ul class="el-pager">
            <li class="number active">{{basciPagination.currentPage}}</li>
          </ul>
        </span>
      </span>
    </el-pagination>
  </div>
</template>
<script>
var self = {};
export default {
  name: "basci-grid",
  props: {
    config: { type: Object, required: true }, //grid 配置
    pagination: {
      type: Object,
      required: false,
      default: function() {
        return {};
      }
    } //分页栏配置
  },
  methods: {
    /*
                1.修复表头最后的gutter的背景色和表头一致 让列头不出现滚动条的宽度
                2.表头最后一列的右边框置none
                3.修复elementui table列设置 resizable false 后还可以拖动的Bug
            */
    headerColumsRepair: function() {
      var el = this.$refs[this.basciConfig.ref].$el;
      var headColums = el.getElementsByClassName("is-leaf");
      if (headColums.length > 0 && this.basciConfig.columns.length > 0) {
        var lastColum = headColums[headColums.length - 1];
        lastColum.style.borderRight = "none";
        var gutter = el.getElementsByClassName("gutter");
        if (
          gutter.length > 0 &&
          typeof this.basciConfig.headerCellStyle.background !== "undefined"
        ) {
          gutter[0].style.backgroundColor = this.basciConfig.headerCellStyle.background;
        }
      }

      var tableHeader = this.$refs[this.basciConfig.ref].$refs.tableHeader;
      var handleMouseDown = tableHeader.handleMouseDown;

      tableHeader.handleMouseDown = function(e, t) {
        if (!t.resizable) {
          return false;
        } else {
          handleMouseDown.call(this, e, t);
        }
      };
    },
    componentReady: function() {
      this.basciPagination = Object.assign(
        {},
        this.basciPagination,
        this.pagination
      );

      this.basciConfig = Object.assign({}, this.basciConfig, this.config);

      /** elementui  2.13.0 版本修复了 挂载组件默认执行排序的bug
                    if(this.basciConfig.defaultSort) {
                        this.isDefaultSortLoad = true
                    }
                */
      //如果定义了分页栏layout 的slot 那么就固定一种格式 prev, slot, next
      if (
        this.basciPagination.layout &&
        this.basciPagination.layout.indexOf("slot") != -1
      ) {
        this.basciPagination.layout = "prev, slot, next";
      }

      //最后一列不让拖拽
      if (this.basciConfig.columns.length > 0) {
        this.basciConfig.columns[
          this.basciConfig.columns.length - 1
        ].resizable = false;
      }

      //用来控制是否禁用分页
      this.basciPagination.defaultDisabled = this.basciPagination.disabled

      this.basciPagination.total =
        this.basciPagination.total || this.basciPagination.pageSize;

      this.$set(this.pagination, "total", this.basciPagination.total);

      this.basciConfig.loading = false;

      this.basciConfig.selectRows = this.config.selectRows = [];

      this.basciConfig.showLoading = this.config.showLoading = this.showLoading;

      this.basciConfig.updateScrollbar = this.config.updateScrollbar = this.updateScrollbar;

      this.basciConfig.updateSyncPostion = this.config.updateSyncPostion = this.updateSyncPostion;

      //this.basciConfig.showLoading =  this.showLoading

      this.config.setSingleDefault = this.setSingleDefault;

      this.config.doLayout = this.doLayout;

      this.config.beforeSort = {};

      if (
        this.basciConfig.defaultSort &&
        this.basciConfig.defaultSort.prop &&
        this.basciConfig.defaultSort.order
      ) {
        this.config.sort = this.basciConfig.sort = {
          column: this.basciConfig.defaultSort.prop,
          order: this.basciConfig.defaultSort.order
            .replace("descending", "desc")
            .replace("ascending", "asc")
        };

        this.basciConfig.beforeSort = this.config.beforeSort = {
          column: this.basciConfig.defaultSort.prop,
          order: this.basciConfig.defaultSort.order
        };
      } else {
        this.config.sort = this.basciConfig.sort = { column: "", order: "" };
      }
    },
    //分页pageSize 改变时会触发 变更后 页码从1开始
    handleSizeChange: function(val) {
      this.basciPagination.pageSize = this.pagination.pageSize = val;

      this.pagination.currentPage = this.basciPagination.currentPage = 1;

      this.basciConfig.loading = this.config.loading = true;

      this.$emit("size-change", this.basciConfig, this.basciPagination);
    },
    //当用户手动勾选数据行的 Checkbox 时触发的事件
    select: function(selection, row) {
      var checked = false;
      if (this.basciConfig.selectType == "single") {
        this.clearSelection();

        if (this.basciConfig.highlightCurrentRow) {
          this.$refs[this.basciConfig.ref].setCurrentRow();
        }

        if (selection.length === 0) {
          //单选一个都没有选中的情况
          this.basciConfig.selectRows = this.config.selectRows = selection;
        } else {
          //单选的切换选中
          checked = true;
          this.basciConfig.selectRows = this.config.selectRows = [row];
          if (this.basciConfig.highlightCurrentRow) {
            this.$refs[this.basciConfig.ref].setCurrentRow(row);
          }

          this.toggleRowSelection(row, true); //设置 当前切换选中的 checkbox 为选中
        }
      } else {
        //操作的行数据在全部选择数据中存在 则认为是选中
        this.$refs[this.basciConfig.ref].setCurrentRow();
        checked =
          selection.filter(function(o, i) {
            return o == row;
          }).length > 0;
        this.basciConfig.selectRows = this.config.selectRows = selection;
      }
      this.$emit("select", this.basciConfig.selectRows, row, checked);
    },
    //checkbox全选事件
    selectAll: function(rows) {
      this.$refs[this.basciConfig.ref].setCurrentRow();
      this.basciConfig.selectRows = this.config.selectRows = rows;
      this.$emit("select-all", rows);
    },
    //刷新事件
    refreshEvent:function(){
      this.$emit("refresh", this.basciConfig, this.basciPagination);
    },
    //分页页码变动事件
    handleCurrentChange: function(pageIndex) {

      this.basciConfig.selectRows = this.config.selectRows = [];

      this.clearSelection();

      this.basciConfig.loading = this.config.loading || true;

      this.basciPagination.disabled = this.pagination.disabled = true;

      this.basciPagination.currentPage = this.pagination.currentPage = pageIndex;

      this.$emit("current-change", this.basciConfig, this.basciPagination);
    },
    //行记录双击事件
    rowDbClick: function(row, column, event) {
      this.$emit("row-dbclick", row, column, event);
    },
    //列双击点击事件
    cellDblClick: function(row, column, cell, event) {
      this.$emit("cell-dbclick", row, column, event);
    },
    //列单击事件
    cellClick: function(row, column, cell, event) {
      this.$emit("cell-click", row, column, event);
    },
    //展开行事件
    expandChange: function(row, expandedRows) {
      this.$emit("expand_change", row, expandedRows);
    },
    //行记录单击事件
    rowClick: function(row, column, event) {
      /** 多选
       * 已选行包含了当前行 删除所选行以及前面的勾选 并取消当前行的高亮
       * 已选行未包含当前行 设置勾选 并 把此行追加到已选行数组 取消高亮
       */
      if (this.basciConfig.selectType == "multiple") {
        //判断当前选中行是否在已经选择的选中行数组中
        if (
          this.basciConfig.selectRows.filter(function(o, i) {
            return o == row;
          }).length > 0
        ) {
          var rows = this.basciConfig.selectRows.filter(function(o, i) {
            return o != row;
          });
          this.basciConfig.selectRows = this.config.selectRows = rows;
          this.toggleRowSelection(row, false);
          //选中行是否高亮
          if (this.basciConfig.highlightCurrentRow) {
            this.$refs[this.basciConfig.ref].setCurrentRow();
          }
        } else {
          this.basciConfig.selectRows.push(row);
          this.config.selectRows = this.basciConfig.selectRows;
          this.toggleRowSelection(row, true);
          //选中行是否高亮
          if (this.basciConfig.highlightCurrentRow) {
            this.$refs[this.basciConfig.ref].setCurrentRow(row);
          }
        }
      }
      //单选 清空所有 选项 然后设置当前行为选中 并 添加高亮
      else if (this.basciConfig.selectType == "single") {
        //当前行第二次选中取消高亮和checkbox的选中
        if (
          this.basciConfig.selectRows.length > 0 &&
          this.basciConfig.selectRows.filter(function(o, i) {
            return o == row;
          }).length == 1
        ) {
          //清空所有checkbox 选中
          this.clearSelection();
          //选中行是否高亮
          if (this.basciConfig.highlightCurrentRow) {
            //取消当前行的高亮
            this.$refs[this.basciConfig.ref].setCurrentRow();
          }
        } else {
          //清空所有checkbox 选中
          this.clearSelection();
          //设置选中行为当前行
          this.basciConfig.selectRows = this.config.selectRows = [row];
          //选中当前行的checkbox
          this.toggleRowSelection(row);
          //选中行是否高亮
          if (this.basciConfig.highlightCurrentRow) {
            //设置当前行的高亮
            this.$refs[this.basciConfig.ref].setCurrentRow(row);
          }
        }
      } else {
        this.basciConfig.selectRows = this.config.selectRows = [row];
      }
      this.$emit("row-click", row, column, event);
    },
    //排序事件
    sortChange: function(column) {
      /*  elementui  2.13.0 版本修复了 挂载组件默认执行排序的bug
                    if(this.isDefaultSortLoad){
                        this.isDefaultSortLoad = false
                        return
                    } 
                */

      /*
                重复点击当前排序列的时候取消设置排序order为null的设定,当前排序列的order取反
                */
      this.basciPagination.disabled = this.pagination.disabled = true;

      this.basciConfig.loading = this.config.loading || true;

      this.clearSelection();

      this.pagination.currentPage = this.basciPagination.currentPage = 1;

      //如果真 说明重复点击了当前排序图标的排序 取反order重新设置排序 不执行emit , 否则  column 就是当前新的排序字段
      if (
        column.order == null &&
        this.basciConfig.beforeSort.column == column.prop
      ) {
        //排序取反
        var inverseOrder =
          this.basciConfig.beforeSort.order == "descending"
            ? "ascending"
            : "descending";

        this.basciConfig.beforeSort.order = this.config.beforeSort.order = inverseOrder;

        this.config.sort = this.basciConfig.sort = {
          column: column.prop,
          order: this.basciConfig.beforeSort.order
            .replace("descending", "desc")
            .replace("ascending", "asc")
        };
        //重复点击了排序图标 则重置排序为取反的顺序
        this.$refs[this.basciConfig.ref].sort(
          column.prop,
          this.basciConfig.beforeSort.order
        );
        return;
      } else {
        this.basciConfig.beforeSort = this.config.beforeSort = {
          column: column.prop,
          order: column.order
        };
        this.config.sort = this.basciConfig.sort = {
          column: column.prop,
          order: column.order
            .replace("descending", "desc")
            .replace("ascending", "asc")
        };
      }

      this.$emit("sort-change", this.basciConfig, this.basciPagination);
    },
    //设定与取消选中行
    toggleRowSelection: function(o, flag) {
      if (typeof flag == "undefined")
        return this.$refs[this.basciConfig.ref].toggleRowSelection(o);
      return this.$refs[this.basciConfig.ref].toggleRowSelection(o, flag);
    },

    //清除所有选中行
    clearSelection: function() {
      this.basciConfig.selectRows = this.config.selectRows = [];
      return this.$refs[this.basciConfig.ref].clearSelection();
    },
    //显示隐藏加载loading
    showLoading: function(flag) {
      this.$nextTick(function() {
        this.basciConfig.loading = this.config.loading = flag;
      });
    },
    //表格布局渲染
    doLayout: function() {
      this.$refs[this.basciConfig.ref].doLayout();
    },
    //多选的情况下数据加载后选项框默认选中(需要配置规则 defaultSelectRule)
    defaultSelect: function() {
      if (
        this.basciConfig.defaultSelectRule &&
        this.basciConfig.selectType == "multiple"
      ) {
        this.basciConfig.data.forEach(function(o, i) {
          var flag = self.basciConfig.defaultSelectRule.call(self, o);
          if (flag) {
            self.config.selectRows.push(o);
            self.basciConfig.selectRows = self.config.selectRows;
          }
          self.toggleRowSelection(o, flag);
        });
      }
    },
    //rowClassName的回调方法 用来实现 多选后选中行的背景色
    rowClassName: function(obj) {
      if (
        this.basciConfig.selectType == "multiple" &&
        this.basciConfig.highlightCurrentRow
      ) {
        if (
          this.basciConfig.selectRows.filter(function(o, i) {
            return o == obj.row;
          }).length > 0
        ) {
          return "multipleSelect";
        }
      } else if (
        this.basciConfig.rowClassNameOver &&
        this.basciConfig.highlightCurrentRow
      ) {
        return this.basciConfig.rowClassNameOver.call(this, obj);
      }
    },
    //刷新el-scrollbar
    updateScrollbar: function() {
      this.$nextTick(function() {
        var scroolbar = this.$refs[this.basciConfig.ref].$refs.tableElScrollbar;
        if (typeof scroolbar !== "undefined") {
          scroolbar.update();
        }
      });
    },
    //基于elscrollbar的列对齐方式
    updateSyncPostion: function() {
      this.$nextTick(function() {
        var doSyncPostion = null;
        if (
          typeof this.$refs[this.basciConfig.ref].syncPostionExt !== "undefined"
        ) {
          doSyncPostion = this.$refs[this.basciConfig.ref].syncPostionExt;
        } else if (
          typeof this.$refs[this.basciConfig.ref].syncPostion !== "undefined"
        ) {
          doSyncPostion = this.$refs[this.basciConfig.ref].syncPostion;
        }
        doSyncPostion !== null ? doSyncPostion() : "";
      });
    },
    //未提供总数的计算
    countTotal: function(data) {
      if (this.basciPagination.layout.indexOf("slot") > -1) {
        if (data.length < this.basciPagination.pageSize) {
          if (data.length > 0) {
            this.basciPagination.total =
              (this.basciPagination.currentPage - 1) *
                this.basciPagination.pageSize +
              data.length;
          } else {
            this.basciPagination.total =
              this.basciPagination.currentPage * this.basciPagination.pageSize;
          }
        } else {
          this.basciPagination.total =
            this.basciPagination.pageSize *
            (this.basciPagination.currentPage + 1);
        }
      }
    },
    //手动设置单选 选中
    setSingleDefault: function(row) {
      if (this.basciConfig.selectType == "single") {
        this.clearSelection();
        this.$refs[this.basciConfig.ref].setCurrentRow(row);
        this.$refs[this.basciConfig.ref].toggleRowSelection(row);
        this.basciConfig.selectRows = this.config.selectRows = [row];
      }
    },
    checkAllShowOrHide:function(){
      if (this.basciConfig.selectType == "single") {
        this.$nextTick(function() {
          try {
            var domArr = []
            var dom = this.$refs[this.basciConfig.ref].$el;
            //冻结列的情况
            var fixedDom = dom.getElementsByClassName('el-table__fixed')
            domArr.push(dom)
            if(fixedDom.length>0){
              domArr.push(fixedDom[0])
            }
            for(var i=0;i<domArr.length;i++){
              +function(dom){
                var checkAll_th = dom.getElementsByTagName("th");
                if (
                  checkAll_th.length > 0 &&
                  checkAll_th[0].getElementsByClassName("el-checkbox").length > 0
                ) {
                  checkAll_th[0].getElementsByClassName(
                    "el-checkbox"
                  )[0].style.display = "none";
                }
              }(domArr[i])
            }
          } catch (error) {
            console.log("checkAll_dom_error:", error);
          }
        });
      }
    },
    jumpFirst: function() {
      if (this.pagination.currentPage == 1) return;
      this.handleCurrentChange(1);
    }
  },
  data: function() {
    return {
      /*
                 elementui  2.13.0 版本修复了 挂载组件默认执行排序的bug
                 用来控制设置default-sort 后页面加载第一次自动运行 sort-change 事件
                 isDefaultSortLoad:false,
                 */
      //默认的排序规则
      sortOrders: ["ascending", "descending"],
      //分页栏默认配置
      basciPagination: {
        ref: "basciPagination",
        background: true,
        currentPage: 1,
        pageSize: 50,
        disabled: false,
        defaultDisabled:false,  //用来控制是否禁用分页
        layout: "prev, pager, next, jumper",
        style: { textAlign: "center", marginTop: "10px" },
        show: true,
        total: ""
      },
      //table的默认配置
      basciConfig: {
        ref: "basciTable",
        emptyText: "",
        basciScroll: true, //暂不开放 对IE 11以下兼容并不好
        loading: true,
        border: true,
        headerCellStyle: {
          background: "#198FFF",
          color: "#fff",
          fontWeight: "400"
        },
        headerRowStyle: { minHeight: "40px", height: "40px" },
        columns: [],
        sort: {},
        beforeSort: {},
        stripe: false,
        highlightCurrentRow: true,
        width: "100%",
        style: { width: "100%" },
        refresh:{show:false},
        data: []
      }
    };
  },
  watch: {
    //由于props 单向传输所以通过监听来满足双向绑定
    "basciConfig.data": function(newValue, oldValue) {
      this.checkAllShowOrHide()
      this.countTotal(newValue);

      this.basciConfig.data = this.config.data = newValue;
      this.basciConfig.selectRows = this.config.selectRows = [];
      this.$nextTick(function() {
        this.defaultSelect();
        this.$refs[this.basciConfig.ref].bodyWrapper.scrollTop = 0;
        this.$refs[this.basciConfig.ref].bodyWrapper.scrollLeft = 0;
        this.basciConfig.loading = this.config.loading = this.basciPagination.disabled = this.pagination.disabled = false

        //禁用分页
        if(this.basciPagination.defaultDisabled){
          this.basciPagination.disabled = this.pagination.disabled = true;
        }
        //重新计算grid的布局 为了修正ie 下表头错位
        this.$refs[this.basciConfig.ref].doLayout();
        this.headerColumsRepair();
        //elscrollbar 刷新
        this.updateScrollbar();
        //对齐列和表头的重写方法
        this.updateSyncPostion();
      });
    },
    //由于props 单向传输所以通过监听来满足双向绑定
    "config.data": function(newValue, oldValue) {
      this.checkAllShowOrHide()
      this.countTotal(newValue);
      this.basciConfig.data = this.config.data = newValue;
      this.basciConfig.selectRows = this.config.selectRows = [];
      this.$nextTick(function() {
        this.$refs[this.basciConfig.ref].bodyWrapper.scrollTop = 0;
        this.$refs[this.basciConfig.ref].bodyWrapper.scrollLeft = 0;
        this.basciConfig.loading = this.config.loading = this.basciPagination.disabled = this.pagination.disabled = false;

        //禁用分页
        if(this.basciPagination.defaultDisabled){
          this.basciPagination.disabled = this.pagination.disabled = true;
        }
        //重新计算grid的布局 为了修正ie 下表头错位
        this.$refs[this.basciConfig.ref].doLayout();
        this.headerColumsRepair();
        //elscrollbar 刷新
        this.updateScrollbar();
        //对齐列和表头的重写方法
        this.updateSyncPostion();
      });
    },
    "config.columns": function(newValue, oldValue) {
      this.basciConfig.columns = this.config.columns = newValue;
    },
    "basciPagination.currentPage": function(newValue, oldValue) {
      this.basciPagination.currentPage = this.pagination.currentPage = newValue;
    },
    "pagination.currentPage": function(newValue, oldValue) {
      this.basciPagination.currentPage = this.pagination.currentPage = newValue;
    },
    "basciPagination.total": function(newValue, oldValue) {
      this.basciPagination.total = this.pagination.total = newValue;
    },
    "pagination.total": function(newValue, oldValue) {
      this.basciPagination.total = this.pagination.total = newValue;
    },
    //多选默认选中规则变更
    "config.defaultSelectRule": function() {
      this.basciConfig.defaultSelectRule = this.config.defaultSelectRule;
      var data = this.basciConfig.data;
      this.basciConfig.data = [];
      this.basciConfig.selectRows = this.config.selectRows = [];
      this.$nextTick(function() {
        this.basciConfig.data = this.config.data = data;
      });
    },
    //监听单选和多选的配置 如果单选则不显示全选按钮
    "basciConfig.selectType": function(newValue, oldValue) {
      this.checkAllShowOrHide()
    }
  },
  beforeCreate: function() {
    self = this;
  },
  created: function() {
    this.componentReady();
  },
  mounted: function() {
        var scroolbar = this.$refs[this.basciConfig.ref].$refs.tableElScrollbar;
        if (typeof scroolbar !== "undefined") {
          this.$refs[this.basciConfig.ref].layout.gutterWidth=0
        }
  }
};
</script>
