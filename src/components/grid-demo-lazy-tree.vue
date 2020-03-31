<template>
<div>
  <H1 style="text-align:center">table-tree-lazy</H1>
  <el-table
    :data="tableData"
    style="width: 100%"
    row-key="id"
    :headerCellStyle='{background: "#198FFF",color: "#fff",fontWeight: "400"}'
    highlight-current-row
    border
    lazy
    :load="load"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column
      prop="date"
      label="日期"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
  </el-table>
</div>
</template>
<script>
  import "css/basci-grid.css";
  export default {
    data() {
      return {
        tableData: [{
          id: 3,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          hasChildren: true
        },{
          id: 4,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          hasChildren: true
        }]
      }
    },
    methods: {
      load(tree, treeNode, resolve) {
        if(tree.id==3){
            setTimeout(() => {
                debugger;
            resolve([
                {
                id: 31,
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
                }, {
                id: 32,
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
                }
            ])
            }, 1000)
        }else{
            resolve([])
        }
      }
    },
  }
</script>
