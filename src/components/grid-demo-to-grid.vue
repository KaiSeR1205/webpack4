<template>
    <basci-grid
      ref="basciGrid"
      :config="grid"
      :pagination="pagination"
      @sort-change="loadData"
      @current-change="loadData"
      @expand_change="expandChange" 
      @cell_dblclick="cellDbClick"
      @cell_click="cellClick"
    >
    <template slot="slotColum">
        <el-table-column :min-width="minWidth" :width="width" type="expand" sortable >
            <template slot-scope="props">
                <basci-grid :ref="props.row.key"
                 :config="sub_grid"
                 :pagination="sub_pagination"
                ></basci-grid>        
            </template>
        </el-table-column>
        <el-table-column label="编号"  prop="id" sortable ></el-table-column>
        <el-table-column label="姓名"  prop="name" sortable ></el-table-column>
    </template>
    </basci-grid>  
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
      minWidth:"",
      current:{
          row:{},
          cell:{},
          checked:false
      },
      beforeOpenRow:{
          row:{},
          cell:""
      },
      width:"",
      id_column:[
          {prop:"id_column",label:"id_grid",sortable:"custom"},
          {prop:"id_column_name",label:"id_grid_name",sortable:"custom"}
      ],
      name_column:[
          {prop:"name_column",label:"name_grid",sortable:"custom"},
          {prop:"name_column_name",label:"name_grid_name",sortable:"custom"}
      ],
      sub_grid:{
          height:"100%",
          highlightCurrentRow:false,
          columns: [{
              prop:"sub_id",
              label:"sub_编号",
              sortable:true
          },{
              prop:"sub_name",
              label:"sub_姓名",
              sortable:true
          }],
          data:[
              {sub_id:"1_1",sub_name:"sub_好滋好味鸡蛋仔"}
          ]
      },
      sub_pagination:{
          show:false
      },
      grid: {
        cellClassName:function(obj){
            return self.cellClassName(obj)
        },
        height: "90%",
        slot:"slotColum",
        highlightCurrentRow:false,
        defaultSort: { prop: "id", order: "ascending" },
        columns: [],
        /*表格数据*/
        data:[]
      },
      pagination: {
        currentPage: 1,
        pageSize: 20
      }
    };
  },
  methods: {  
    cellClassName:function(obj){
        if(obj.row == this.current.row  && obj.column.property == this.current.cell&&this.current.checked){
            return 'cellTest'
        }
        
    },
    cellClick:function(row, column, cell, event){
        if(this.current.row == row && this.current.checked){
            this.current.checked = false
        }else{
            this.current.checked = true
        }
        this.current.row = row
        this.current.cell = column.property
        self.$refs.basciGrid.$refs.basciTable.toggleRowExpansion(this.beforeOpenRow.row)
        this.beforeOpenRow = {row:{},cell:{}}
    },
    cellDbClick:function(row, column, cell, event){
        self.$refs.basciGrid.$refs.basciTable.toggleRowExpansion(this.beforeOpenRow.row,false)
        self.$nextTick(function(){
            self.$refs.basciGrid.$refs.basciTable.toggleRowExpansion(row,true)
        })
        
        this.beforeOpenRow.row = row
        this.beforeOpenRow.cell = column.property

        var z = column.property+'_column'
        this.sub_grid.columns=self[z]
        var temp_data =[]
        if(column.property=="id"){
            temp_data = {
                id_column:"test_id_column",
                id_column_name:"test_id_column_name"
            }
            this.sub_grid.defaultSort = { prop: "id_column", order: "ascending" }
        }else if(column.property=="name"){
            temp_data =  {
                name_column:"test_name_column",
                name_column_name:"test_name_column_name"
            }        
            this.sub_grid.defaultSort = { prop: "name_column", order: "ascending" }
        }
        //下面这里可从数据库获取数据
        this.sub_grid.data = []
        for(var i=0;i<row.id;i++){
           this.sub_grid.data.push(temp_data) 
        }
        //更改key 渲染grid
        row.key="grid_"+new Date().getTime()
        
    },
    expandChange:function(row,expandedRows){

    },
    //获取数据的方法里面可以是一个请求
    loadData: function(gridConfig, pageConfig) {    
      console.log("当前页:", pageConfig.currentPage);
      console.log("排序字段:", gridConfig.sort.column);
      console.log("排序order:", gridConfig.sort.order);
      gridConfig.data = [];
      this.$nextTick(function(){
            this.$nextTick(function(){
            vm.grid.showLoading(true)
                setTimeout(function() {
                    if (pageConfig.currentPage < 90) {
                    for (var i = 0; i < pageConfig.currentPage; i++) {
                        gridConfig.data.push({
                            id: (i+1),
                            name: '好滋好味鸡蛋仔'+(i+1),
                            key:"key_"+(i+1)
                        });
                    }
                    }
                }, 2000);
            })
      })
    },
  },
  beforeCreate() {
    window.vm = this
    self = this;
  },
  mounted: function() { 
      this.width=1
      this.minWidth=1
      this.loadData(this.grid,this.pagination)
      
  }
};
</script>

<style>
</style>