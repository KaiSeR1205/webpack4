<template>
  <div style="height:100%;over-flow:auto">
    <h1>ellipsis-tooltip(1)</h1>
      <div style="width:100%" class="over-flow">
              <ellipsisTooltip placement="top">
                <div slot="contentExt">{{name}}<br/>{{value}}<br/>没有tooltip</div>
                <span slot="desc">{{name}}<br/>{{value}}<br/>没有tooltip</span>
              </ellipsisTooltip>
      </div>
      
      <h1 style="margin-top:20px">ellipsis-tooltip(2)</h1>
      <div style="width:500px" class="over-flow">
              <ellipsisTooltip placement="bottom">
                <div slot="contentExt">{{name}}<br/>{{value}}<br/>有tooltip</div>
                <span slot="desc">{{name}}<br/>{{value}}<br/>有tooltip</span>
              </ellipsisTooltip>
      </div>

      <h1 style="margin-top:20px">table-ellipsis-tooltip</h1>
      <div>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="180">
              <template slot-scope="scope">
                <ellipsisTooltip placement="top">
                  <div slot="contentExt">{{scope.row.name}}<br/>11111</div>
                  <span slot="desc">{{scope.row.name}}<br/>11111</span>
                </ellipsisTooltip>
              </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址"
            width="150">
              <template slot-scope="scope">
                <ellipsisTooltip placement="top">
                  <div slot="contentExt">{{scope.row.address}}</div>
                  <span slot="desc">{{scope.row.address}}</span>
                </ellipsisTooltip>
              </template>
          </el-table-column>
        </el-table>
      </div>
  </div>
</template>
<script>
import ellipsisTooltip from "@/ellipsis-tooltip.vue";
export default {
      name: "tooltip",
      components:{
        ellipsisTooltip
      },
      data() {
          return {
              tableData: [{
                date: '2016-05-02',
                name: '王小虎计算机客户近段时间很快就好看',
                address: '上海市普陀区金沙江路 1518 弄'
              }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄上海市普陀区金沙江路 1517 弄上海市普陀区金沙江路 1517 弄'
              }, {
                date: '2016-05-01',
                name: '王小虎就看见几号回家好久好久好看就可好看好好计划花见花开健康好好看好看京东数科会受到空间和会计师',
                address: '上海市普陀区金沙江路 1519 弄'
              }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
              }],
              showTooltip:true,
              name:"上海或多或少收到货收到货对方接口放大镜开电脑金风科技大幅度九分裤四大皆空圣诞节会计师对健康的数据库",
              value:"9808677几点睡的数据库的角色看到江苏科技的手机端数据都是近段时间"
          }
      },
      methods:{
        xx(row){
          return row.name+'<br/>'+row.address
        },
        onMouseOver(event){
          let current = event.target
          let parent = event.target.parentNode  //offsetWidth
          if (current.offsetWidth > parent.offsetWidth) {
            this.showTooltip = false;
          } else {
            this.showTooltip = true;
          }
        }
      },
      mounted() {
          window.vm = this
      }

}
</script>
<style scoped>
  .over-flow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>