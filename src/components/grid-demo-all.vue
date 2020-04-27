<template>
  <basciGrid
    ref="basciGrid"
    :config="grid"
    :pagination="pagination"
    @current-change="currentChange"
    @size-change="pageSizeChange"
    @select-all="selectAll"
    @row-dbclick="rowDbClick"
    @sort-change="sortChange"
    @select="selectEvent"
    @refresh="refreshEvent"
  >
  <!-- <template slot-scope="scope" slot="slotButton"><el-button @click="slotButton_click(scope)">xx</el-button></template> -->
  </basciGrid>
</template>
<script>
import "css/basci-grid.css";
import basciGrid from "@/basci-grid.vue";
window.vm = {};
var self={}
var render =null
export default {
  name: "grid",
  components: {
    basciGrid
  },
  data: function() {
    return {
      pagination: {
        ref: "myPagination", //默认ref:basciPagination 用来获取 pagination 组件的所有信息
        background: true, //分页栏是否有背景色 非必传默认 true
        currentPage: 1, //当前页   默认值1
        pageSize: 50, //页尺寸 非必传 默认 50
        pageSizes: [50, 100],
        /**
         *分页栏的格式 非必传 默认"prev, pager, next, jumper"
         *total:总数
         *sizes:每页尺码
         *prev:上一页
         *pager:页码
         *next:下一页
         *jumper:跳转
         */
        layout: "prev, pager, next, total,jumper",
        /**
         *总数 非必传 默认值暂定为 99页 pageSize*99
         *如有有超过99分页的数据并且要显示jumper或total的话 建议赋真实总数值
         */
        total: 1000
      },
      grid: {
        /**
         *Table 的高度，默认为自动高度。
         *如果 height 为 number 类型，单位 px；
         *如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，
         *Table 的高度会受控于外部样式。
         *非必传
         */
        height: "90%",

        ref: "myGrid", //默认ref:basciTable 用来获取 table 组件的所有信息

        //刷新图标   事件绑定 $emit refresh
        refresh:{
          show:true,                 //默认false
          icon:"el-icon-refresh",    //默认 el-icon-refresh
          class:"refreshOver"        //class   非必传
        },

        //single(单选) or multiple(多选) 如果不需要复选框  columns 里面不要设置 type=selection 的列
        selectType: "multiple",

        //选中行是否高亮
        highlightCurrentRow:true,

        //空数据时候的文本  默认为:暂无数据
        emptyText: "没有更多了",

        //加载时的loading  非必传默认true
        loading: true,

        /*表格是否自带边框  默认true*/
        border: true,

        /**
         *表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style。
         *默认 { background: '#F3F4F7', color: '#555' }
         *非必传
         */
        headerCellStyle: {
          background: "#198FFF",
          color: "#fff",
          fontWeight: "400"
        },
        /**
         *descending 或者 "ascending 如果设置了页面加载会自动执行sort-change
         */
        defaultSort: { prop: "date", order: "descending" },

        /**
         *  默认选中规则
         * selectTpe是 multiple 的情况下并且设置了 defaultSelectRule
         * row当前行的数据
        */
        defaultSelectRule: function(row) {
          return row.status == "1";
        },

        //表格列信息 类型为Array  必传
        columns: [
          {
            prop: "id",
            fixed:"left",
            type: "selection",
            //fixed:'left',    //定位最左边滚动时不会移动
            width: "55px"
          },
          {
            prop: "date", //字段名
            label: "时间", //字段中文名
            align: "center", //显示位置 left right center
            width: "180", //宽度
            /**
             *custom:后台排序, 建议使用这个
             *true:前台 table控件自己完成Array.sort 排序
             *false:不启用排序
             */
            sortable: "custom"
          },
          {
            prop: "desc",
            label: "描述",
            align: "center",
            width: "100",
            sortable: true, //table控件对tableData执行 Array.sort 排序
            showOverflowTooltip: true //当内容超出了设定的width 则显示传... 类似 css text-overflow:ellipsis效果
          },
          {
            prop: "status",
            label: "formatBasic",
            align: "center",
            width: "120",
            formatter: function(row, columns) {
              return row.status == 1 ? "开启" : "结束";
            } //类似picklist 显示中文
          },
          {
            label: "formatInput",
            align: "center",
            width: "300",
            formatter: function(row, columns) {
              return self.formatterInput(self.$createElement,row, columns);
            } //自定义el-input
          },
          {
            label: "formatSelect",
            align: "center",
            width: "120",
            formatter: function(row, columns) {
              return self.formatterSelect(self.$createElement,row, columns);
            } //自定义el-select
          },
          {
            label: "formatHtml",
            align: "center",
            width: "380",
            formatter: function(row, columns) {
              return self.formatterHtml(self.$createElement,row, columns);
            } //自定义html
          },
          {
            label: "formatPopover",
            align: "center",
            width: "180",
            formatter: function(row, columns) {
              return self.formatterPopover(self.$createElement,row, columns);
            } //自定义html
          },
          {
            label: "formatButton",
            align: "center",
            minWidth:"200",
            formatter: function(row, columns) {
              return self.formatterButton(self.$createElement,row, columns);
            } //自定义button
          }
          // ,
          // {
          //   label: "slotButton",
          //   align: "center",
          //   slot:"slotButton"
          // }
        ],
        /*表格数据*/
        data: []
      }
    };
  },
  methods: {
    /**  vue 的 $createElement
     * 第一个参数:标签名 {String | Object | Function}
     * 第二个参数 对于component的配置参数 类型object 可以包含 props(object)、on(object)、style(object)、css(Array) 等
     * 第三个参数 子节点 VNodes 由于 $createElement创建 或者 字符串的文本 {String | Array}
     */

    // slotButton_click:function(scope){
    //   console.log(scope)
    // },
    //格式化select
    formatterSelect: function(h,row, column) {
      var ref = "selectRef" + row.id;
      return <el-select
              ref={ref}
              size="small"
              value = {row.select}
              on-change={function(o){
                //必须定义才可以双向绑定(props 单向数据传输绑定)
                row.select = o;
                self.$nextTick(function() {
                  alert(
                    JSON.stringify({
                      label: self.$refs[ref].selectedLabel,
                      value: o
                    })
                  );
                });               
              }}>
                <el-option key="1" label="one" value="1"></el-option>
                <el-option key="2" label="two" value="2"></el-option>
            </el-select>
      // return this.$createElement(
      //   "el-select",
      //   {
      //     ref: ref, //添加refs引用 以便获取当前组件的所有信息
      //     on: {
      //       change: function(o, z, s) {
      //         //必须定义才可以双向绑定(props 单向数据传输绑定)
      //         row.select = o;
      //         self.$nextTick(function() {
      //           alert(
      //             JSON.stringify({
      //               label: self.$refs[ref].selectedLabel,
      //               value: o
      //             })
      //           );
      //         });
      //       }
      //     },
      //     props: {
      //       size: "small",
      //       value: row.select
      //     }
      //   },
      //   [
      //     this.$createElement("el-option", {
      //       props: {
      //         key: 1,
      //         label: "one",
      //         value: "1"
      //       }
      //     }),
      //     this.$createElement("el-option", {
      //       props: {
      //         key: 2,
      //         label: "two",
      //         value: "2"
      //       }
      //     })
      //   ]
      // );
    },
    //格式化html
    formatterHtml: function(h,row, column) {
      // return this.$createElement(
      //   "div",
      //   {
      //     attrs: {
      //       id: row.date
      //     },
      //     style: { color: "red" }
      //   },
      //   row.desc
      // );
      return <div id={row.date} style="color:red">{row.desc}</div>
    },
    //格式化input
    formatterInput: function(h,row, column) {
      return <el-input type="text" size="small" value={row.input} on-input={function(o){return row.input=o}} ></el-input>
      // return this.$createElement("el-input", {
      //   props: {
      //     type: "text",
      //     size: "small",
      //     value: row.input
      //   },
      //   on: {
      //     input: function(o) {
      //       row.input = o;
      //     } //必须定义才可以双向绑定(props 单向数据传输绑定)
      //   }
      // });
    },
    formatterPopover:function(h,row, column){
      var ref = "popover"+row.id
      return h("el-popover", {
        ref:ref,
        props: {
          placement: "bottom",
          width: "400",
          trigger:"click"
        }
      },[
        h("div",{},[
          h("i",{
            scopedSlots: {
              default:function(props){
                return h('span',props.placement)
              } 
            },
            class:['el-icon-close','popover_i'],  
            on:{
              click:function(e){
                self.$refs[ref].doClose()
              }
            }
          }, this.$slots.default),
          h("h4",{
            class:["popover_title"]
          },"未来取得营销岗位证书"),
          h("div",{
            class:["popover_content"]
          },"你需要在6个月内取得营销岗位资格,不然很遗憾您将无法担任现岗位")
        ],this.$slots.default),
        h("div",{
          slot: 'reference'
        },"dd")
      ]);
    },
    //格式化按钮
    formatterButton: function(h,row, column) {
      return <el-button 
                type="primary" 
                size="mini" 
                style="font-size:12px" 
                class="formatButton"
                on-click={function(){alert(JSON.stringify(row))}}>
                button
            </el-button>
      // return this.$createElement(
      //   "el-button",
      //   {
      //     on: {
      //       click: function() {
      //         alert(JSON.stringify(row));
      //       }
      //     },
      //     style: { fontSize: "12px" },
      //     class: ["formatButton"], //formatButton 是自定义样式
      //     props: {
      //       type: "primary",
      //       size: "mini"
      //     }
      //   },
      //   "button"
      // );
    },
    /**
     *table 的复选框 当用户手动勾选数据行的 Checkbox 时触发的事件
     *selectRows:所有选中的行，row:当前操作的行，checked 是否选中
     */
    selectEvent: function(selectRows, row, checked) {
      console.log("当前所有选中的行:", selectRows);
      console.log("当前操作的行:", row);
      console.log(checked ? "已选中" : "未选中");
    },
    //selectRows:所有选中的行
    selectAll: function(selectRows) {
      console.log("当前所有选中的行:", selectRows);
      console.log(selectRows.length == 0 ? "当页全部未选中" : "当页全部选中");
    },
    //pageSize 变更后触发的事件
    pageSizeChange: function(gridConfig, pageConfig) {
      console.log("pageSize已变更为:" + pageConfig.pageSize);
      console.log("当前页:", pageConfig.currentPage);
      console.log("排序字段:", gridConfig.sort.column);
      console.log("排序order:", gridConfig.sort.order);
      setTimeout(function() {
        gridConfig.data = [];
        if (pageConfig.currentPage < 15) {
          for (var i = 0; i < pageConfig.currentPage; i++) {
            gridConfig.data.push({
              id: i,
              date: "2020-04",
              desc: "那就看你就看就看就看" + i,
              input: "1234",
              select: "",
              status: i % 2 == 0 ? "1" : "2"
            });
          }
        }
      }, 2000);
    },
    //分页页码变动事件
    currentChange: function(gridConfig, pageConfig) {
      console.log("当前页:", pageConfig.currentPage);
      console.log("排序字段:", gridConfig.sort.column);
      console.log("排序order:", gridConfig.sort.order);
      setTimeout(function() {
        gridConfig.data = [];
        if (pageConfig.currentPage < 15) {
          for (var i = 0; i < pageConfig.currentPage; i++) {
            gridConfig.data.push({
              id: i,
              date: "2020-04",
              desc: "那就看你就看就看就看" + i,
              input: "1234",
              select: "",
              status: i % 2 == 0 ? "1" : "2"
            });
          }
        }
      }, 2000);
    },
    //行记录双击事件
    rowDbClick: function(row, column, event) {
      alert(JSON.stringify(row));
    },
    refreshEvent:function(gridConfig, pageConfig){
      console.log("点击了列表刷新");
      console.log("当前页:", pageConfig.currentPage);
      console.log("排序字段:", gridConfig.sort.column);
      console.log("排序order:", gridConfig.sort.order);
      gridConfig.data = [];
      this.$nextTick(function(){gridConfig.showLoading(true)})
      this.$nextTick(function(){
        setTimeout(function() {
          if (pageConfig.currentPage < 15) {
            for (var i = 0; i < pageConfig.currentPage; i++) {
              gridConfig.data.push({
                id: i,
                date: "2020-04",
                desc: "那就看你就看就看就看" + i,
                input: "1234",
                select: "",
                status: i % 2 == 0 ? "1" : "2"
              });
            }
          }
        }, 2000);
      })
    },
    //排序事件
    sortChange: function(gridConfig, pageConfig) {
      console.log("当前页:", pageConfig.currentPage);
      console.log("排序字段:", gridConfig.sort.column);
      console.log("排序order:", gridConfig.sort.order);
      setTimeout(function() {
        gridConfig.data = [];
        if (pageConfig.currentPage < 15) {
          for (var i = 0; i < pageConfig.currentPage; i++) {
            gridConfig.data.push({
              id: i,
              date: "2020-04",
              desc: "那就看你就看就看就看" + i,
              input: "1234",
              select: "",
              status: i % 2 == 0 ? "1" : "2"
            });
          }
        }
      }, 2000);
    }
  },
  beforeCreate() {
    vm = this;
    self = this
  },
  mounted: function() {
    this.grid.data.push({
      id: 0,
      date: "2020-04",
      desc: "那就看你1就看就看就看",
      input: "1234",
      select: "1",
      status: "1"
    });
  }
};
</script>

<style scoped>
div {
  margin-bottom: 10px;
}
.popover_i{
  position:absolute;
  right:10px;
  top:10px;
  font-size:18px 
}
.popover_title{
  margin-top: 0px;
  margin-bottom:10px;
  border-left: 4px solid #ff4d4f;
  padding-left:5px
}
.popover_context{
  color:#a6a7a8;
  font-size:13px
}
</style>