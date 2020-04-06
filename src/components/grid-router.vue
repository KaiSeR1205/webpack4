<template>
  <div>
    <basci-grid ref="basciGrid" :config="grid" :pagination="pagination" @row-dbclick="rowDbClick"></basci-grid>
  </div>
</template>
<script>
import "css/basci-grid.css";




import basciGrid from "@/basci-grid.vue";
var self={}
export default {
  name: "grid-demo-to-grid",
  components: {
    basciGrid
  },
  data: function() {
    return {
      grid: {
        columns: [
          {
            prop: "name",
            label: "功能",
            align: "center",
            width: "180"
          },
          {
            prop: "desc",
            label: "描述",
            align: "center"
          },
          {
            label: "goDemo",
            align: "center",
            width: "180",
            formatter: function(row, columns) {
              return self.createLink(row, columns);
            } //自定义html
          }
        ],
        /*表格数据*/
        data: [
          {
            name: "demo-all",
            desc: "basci-grid demo集合",
            router: "grid-demo-all"
          },
          {
            name: "basci-grid基本功能",
            desc: "basci-grid基本功能",
            router: "grid-demo"
          },
          {
            name: "basci-grid动态加载",
            desc: "basci-grid动态加载",
            router: "grid-demo-config"
          },
          {
            name: "grid-demo-slot",
            desc: "grid-demo-slot",
            router: "grid-demo-slot"
          },
          {
            name: "grid-demo-to-grid",
            desc: "grid-demo-to-grid",
            router: "grid-demo-to-grid"
          },
          {
            name: "grid-demo-other",
            desc: "grid-demo-other",
            router: "grid-demo-other"
          },
          {
            name:'basci-grid自定义合并行或列',
            desc:"basci-grid自定义合并行或列",
            router:"grid-demo-mergeColumn"
          },
          {
            name:'tree',
            desc:"tree",
            router:"tree"
          },
          {
            name:'upload-Demo',
            desc:"upload-Demo",
            router:"upload-Demo"
          },
          {
            name: "el-table filter",
            desc: "el-table 表头筛选",
            router: "grid-demo-filter"
          },
          {
            name: "el-table tree",
            desc: "el-table 树",
            router: "grid-demo-tree"
          },
          {
            name: "el-table lazyTree",
            desc: "el-table 树懒加载子节点",
            router: "grid-demo-lazy-tree"
          }
        ]
      },
      pagination: {
        show: false
      }
    };
  },
  methods: {
    //行记录双击事件
    rowDbClick: function(row, column, event) {
      this.$router.push({
        name: row.router
      });
    },
    createLink: function(row, column) {
      return self.$createElement(
        "el-link",
        {
          on: {
            click: function() {
              self.$router.push({
                name: row.router
              });
            }
          },
          style: { fontSize: "14px" },
          props: {
            type: "primary"
          }
        },
        "go"
      );
    },
  },
  mounted: function() {

  },
  beforeCreate(){
    self = this
  }
};
</script>

<style scoped>
</style>