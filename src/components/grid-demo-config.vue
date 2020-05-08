<template>
    <div style="height:100%">
        <div style="display:flex;align-items: baseline;font-size:14px;margin:10px">
            <div style="margin-right:10px">切换grid:</div>
            <el-select @change="setGridConfig" size="mini" v-model="select">
                <el-option value="1" label="grid1"></el-option>
                <el-option value="2" label="grid2"></el-option>
                <el-option value="3" label="grid3"></el-option>
            </el-select>              
        </div>      
        <basci-grid
            :key="gridKey"
            ref="grid"
            :config="grid"
            :pagination="pagination"
            @sort-change="loadData"
            @current-change="loadData"
            @row-dbclick="rowDbClick"
        >
        </basci-grid>  
    </div>

</template>
<script>
import "css/basci-grid.css";
import basciGrid from "@/basci-grid.vue";
var self = {};
export default {
  name: "grid-demo-config",
  components: {
    basciGrid
  },
  data: function() {
    return {
      gridKey:"grid",
      select:"1",
      tempData:{},
      grid: {
        height: "85%",
        defaultSort: {},
        columns: [],
        /*表格数据*/
        data: []
      },
      pagination: {
        currentPage: 1,
        pageSize: 20
      }
    };
  },
  methods: {
    setGridConfig:function(){
        this.grid.data=[]
        this.grid.columns = []
        this.gridKey = 'grid'+ this.select
        var columns=[]
        if(this.select==1){
            this.tempData= {
                id: 0,
                date: "2020-04",
                desc: "那就看你就看就看就看0"
            }
            columns = [
                {prop:"id",label:"ID",width:"180"},
                {prop:"date",label:"时间",width:"180"},
                {prop:"desc",label:"描述",width:"180"}
            ]
        }else if(this.select==2){
            this.tempData= {
                id: 0,
                name: "王八蛋",
                age:"18"
            }
            columns = [
                {prop:"id",label:"ID",width:"180"},
                {prop:"name",label:"姓名",width:"180"},
                {prop:"age",label:"年龄",width:"180"}
            ]            
        }else if(this.select==3){
            this.tempData= {
                id: 0,
                country: "中国",
                city:"上海"
            }
            columns = [
                {prop:"id",label:"ID",width:"180"},
                {prop:"country",label:"国家",width:"180"},
                {prop:"city",label:"城市",width:"180"}
            ]     
        }
        columns.forEach(function(o,i){
            self.grid.columns.push({
                prop: o.prop,
                label: o.label,
                align: "center",
                width: i==columns.length-1?"":o.width,
                sortable: "custom"
            })
        })
       
        this.grid.defaultSort = { prop: self.grid.columns[0].prop, order: "descending" }
        this.pagination.currentPage = 1
        this.$nextTick(function(){
            this.$nextTick(function(){
                this.grid.showLoading(true)
            })

            setTimeout(function(){
                self.grid.data.push(self.tempData)
            }, 1000);
        })
        
    },
    //获取数据的方法里面可以是一个请求
    loadData: function(gridConfig, pageConfig) {
      console.log("当前页:", pageConfig.currentPage);
      console.log("排序字段:", gridConfig.sort.column);
      console.log("排序order:", gridConfig.sort.order);
      setTimeout(function() {
        gridConfig.data = [];
        if (pageConfig.currentPage < 90) {
          for (var i = 0; i < pageConfig.currentPage; i++) {
            var t = Object.assign({},self.tempData)
            t.id=i
            gridConfig.data.push(t);
          }
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
    this.setGridConfig()
    // this.grid.data.push({
    //   id: 0,
    //   date: "2020-04",
    //   desc: "那就看你就看就看就看0"
    // });
  }
};
</script>

<style scoped>
</style>