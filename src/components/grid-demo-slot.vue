<template>
<div style="height:100%">
            <basci-grid ref="basciGrid" :config="grid" :pagination="pagination" @sort-change="loadData"
                @current-change="loadData" @row-dbclick="rowDbClick">
                <template :slot="grid.columnSlot">
                    <el-table-column fixed="left" prop="branch" width="300" sortable="custom" align="center" label="分行" >
                    </el-table-column>
                    <el-table-column label="三方代理分配人均" align="center">
                        <el-table-column prop="sfHigh" label="最高" width="400" align="center" sortable="custom"></el-table-column>
                        <el-table-column prop="sfLow"  label="最低" width="400"align="center" sortable="custom"></el-table-column>
                    </el-table-column>
                    <el-table-column label="财富分配人均" header-align="center">
                        <el-table-column prop="cfHigh" width="400" label="最高" align="center" sortable="custom"></el-table-column>
                        <el-table-column prop="cfLow" width="400" label="最低" align="center" sortable="custom" :resizable="false" >
                        </el-table-column>
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
  data: function () {
                    return {
                        grid: {
                            height: "90%",
                            stripe:true,
                            columnSlot:"slotColum",
                            defaultSort: { prop: "branch", order: "descending" },
                            /*表格数据*/
                            data: []
                        },
                        pagination: {
                            currentPage: 1,
                            pageSize: 20,
                            total:1000
                        }
                    }
                },
                methods: {
                    loadData: function(gridConfig, pageConfig) {
                        console.log("当前页:", pageConfig.currentPage);
                        console.log("排序字段:", gridConfig.sort.column);
                        console.log("排序order:", gridConfig.sort.order);
                        setTimeout(function() {
                            gridConfig.data = [];
                            if (pageConfig.currentPage < 90) {
                            for (var i = 0; i < pageConfig.currentPage; i++) {
                                gridConfig.data.push({
                                branch: '上海分行',
                                sfHigh: 100*(1+i),
                                sfLow: 10*(1+i),
                                cfHigh:300*(1+i),
                                cfLow:20*(1+i)
                                });
                            }
                            }
                        }, 2000);
                    },
                    //行记录双击事件
                    rowDbClick: function (row, column, event) {
                        alert(JSON.stringify(row))
                    }
                },
                beforeCreate: function () {
                    self = this
                },
                mounted: function () {
                    this.grid.data.push({
                        branch: '上海分行',
                        sfHigh: 100,
                        sfLow: 10,
                        cfHigh:300,
                        cfLow:20
                    })
                }
};
</script>

<style scoped>
</style>