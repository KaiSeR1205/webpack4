<template>
  <div style="height:100%">
    <basci-grid
      ref="basciGrid"
      :config="grid"
      :pagination="pagination"
      @row-dbclick="rowDbClick"
      @row-click="rowClick"
    ></basci-grid>
  </div>
</template>

<script>
import "css/basci-grid.css";
import basciGrid from "@/basci-grid.vue";
export default {
  name: "grid-demo-mergeColumn",
  components: {
    basciGrid
  },
  data() {
    return {
      grid: {
        height: "90%",
        columns: [
          {
            prop: "id",
            label: "ID",
            width: "180"
          },
          {
            prop: "name",
            label: "姓名"
          },
          {
            prop: "amount1",
            label: "数值 1（元）"
          },
          {
            prop: "amount2",
            label: "数值 2（元）"
          },
          {
            prop: "amount3",
            label: "数值 3（元）"
          }
        ],
        defaultSort: { prop: "id", order: "ascending" },
        /*表格数据*/
        data: [
          {
            id: "12987122",
            name: "王小虎",
            amount1: "234",
            amount2: "3.2",
            amount3: 10
          },
          {
            id: "12987122",
            name: "王小虎",
            amount1: "165",
            amount2: "4.43",
            amount3: 12
          },
          {
            id: "12987122",
            name: "王小虎",
            amount1: "324",
            amount2: "1.9",
            amount3: 9
          },
          {
            id: "12987123",
            name: "王小虎",
            amount1: "621",
            amount2: "2.2",
            amount3: 17
          },
          {
            id: "12987123",
            name: "王小虎",
            amount1: "621",
            amount2: "2.2",
            amount3: 314
          },
          {
            id: "12987123",
            name: "王小虎",
            amount1: "621",
            amount2: "2.2",
            amount3: 123
          },
          {
            id: "12987124",
            name: "王小虎",
            amount1: "621",
            amount2: "2.2",
            amount3: 34
          },
          {
            id: "12987124",
            name: "王小虎",
            amount1: "621",
            amount2: "2.2",
            amount3: 23
          },
          {
            id: "12987125",
            name: "王小虎",
            amount1: "621",
            amount2: "2.2",
            amount3: 173
          },
          {
            id: "12987126",
            name: "王小虎",
            amount1: "621",
            amount2: "2.2",
            amount3: 173
          },
          {
            id: "12987127",
            name: "王小虎",
            amount1: "621",
            amount2: "2.2",
            amount3: 173
          }
        ],
        spanMethod: this.objectSpanMethod,
        rowClassNameOver: this.tableRowClassName
      },
      pagination: {
        disabled:true,
        currentPage: 1,
        pageSize: 20,
        total: 1000
      },
      currentRow: {}
    };
  },
  methods: {
    rowDbClick: function(row, column, event) {
      this.$notify({
        title: "未来取得营销岗位证书",
        dangerouslyUseHTMLString: true,
        message: "你需要在6个月内取得营销岗位资格,不然很遗憾您将无法担任现岗位",
        type: "success"
        //dangerouslyUseHTMLString:true
      });
    },
    tableRowClassName: function(obj) {
      if (obj.row.id == this.currentRow.id) {
        return "multipleSelect";
      }
    },
    rowClick: function(obj) {
      this.currentRow = obj;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        var rowSpan = this.grid.data.filter(function(o, i) {
          return o.id == row.id;
        }).length;
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
  mounted: function() {
    window.vm = this;
  }
};
</script>
<style>
</style>