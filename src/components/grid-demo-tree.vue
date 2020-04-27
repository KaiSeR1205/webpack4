<template>
<div style="height:100%"> 
  <div style="position:relative;height:30px;margin-top:10px">
      <div class="topSearchBar searchBar">
          <el-input clearable size="mini" maxlength="200" :placeholder="searchPlaceholder"
              @keyup.native.enter='searchEvent' v-model="orgSearch" style="width:380px">
              <el-select size="mini" v-model="searchType" slot="prepend" style="color: #fff;width:100px">
                  <el-option label="机构查询" value="1"></el-option>
                  <el-option label="用户查询" value="2"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="searchEvent"></el-button>
          </el-input>
      </div> 
  </div>
 
  <div style="height:100%">
    <el-table
        @expand-change="expandChange"
        ref="tableTree"
        height="85%"
        :data="tableData"
        style="width: 100%"
        row-key="SPDB_OrgCode"
        :headerCellStyle='{background: "#198FFF",color: "#fff",fontWeight: "400"}'
        highlight-current-row
        border
        @row-dblclick	="rowDbClicl"
        :tree-props="{hildren: 'children',
            label: 'label',
            isLeaf: 'leaf'}">
        <el-table-column
          prop="SPDB_OrgName"
          show-overflow-tooltip
          label="机构"
          width="300">
          <template slot-scope="scope">
            <span><i v-show="scope.row.leaf" class="fa fa-dot-circle-o"></i>{{scope.row.SPDB_OrgName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="SPDB_OrgCode"
          label="机构号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="SPDB_BranchCode"
          label="所属分行">
        </el-table-column>
      </el-table>
  </div>
  
</div>
</template>
<script>
  import "css/basci-grid.css";
  import "css/font-awesome.css";
  import { getCascaderData } from "js/cascader-data.js";
  var self = {}
  export default {
    data() {
      return {
        searchType: "1",
        searchPlaceholder:"请输入机构号",
        orgSearch: "",
        tableTreeData:getCascaderData(),
        tableData: []
      }
    },

    methods: {
      searchEvent:function(){
          if(this.searchType=="1"){
              //输入参数为空 则查找当前用户所在机构的下辖机构
              if(this.orgSearch==""){
                  this.allExpanded(false)
                  return
              }
              var node = []
              //先按照机构号在内存里精准筛选 如果没找到则用机构名称匹配查找 
              node = this.tableTreeData.filter(function(o,i){
                  return o.SPDB_OrgCode == self.orgSearch
              })
              if(node.length<=0){
                  //机构名称匹配模糊查找 优先级为机构等级
                node = this.tableTreeData.filter(function(o,i){
                    return o.SPDB_OrgName.indexOf(self.orgSearch)>-1
                })
              }
              if(node.length>0){
                node = node.sort(function(a,b){return a.SPDB_Lev-b.SPDB_Lev})
                this.allExpanded(false)
                this.openRowExpanded(node[0])
              }

          }else{
              console.log('用户搜索:'+this.orgSearch)
          }
      }, 
      //通过中文搜索机构
      searchOrgByLabel:function(){
          var node = this.tableTreeData.filter(function(o,i){
              return o.SPDB_OrgName.indexOf(self.orgSearch)>-1
          })
          return node
      },     
      //转换tree结构数据
      toTreeData: function(data, pOrgCode) {
        function tree(orgCode) {
          var arr = [];
          data
            .filter(function(item){
              return item.SPDB_ParentOrgCode === orgCode;
            })
            .forEach(function(item){
              var t = tree(item.SPDB_OrgCode);
              if(t.length>0){
                item.children = t
              }
              item.leaf = !t.length>0
              arr.push(item);
            });
          return arr;
        }
        return tree(pOrgCode);
      },  
      expandChange:function(row,expanded){
        //关闭父节点的同时关闭其子节点
        if(!expanded){
          this.closeRowExpadned(row)
        }
      },	
      //开关所有节点
      allExpanded:function (flag) {
        this.$refs.tableTree.setCurrentRow({})
        for (var i = 0; i < this.tableTreeData.length; i++) {
          this.$refs.tableTree.toggleRowExpansion(this.tableTreeData[i],flag)
        }
      },  
      //关闭节点 同时关闭子节点
      closeRowExpadned:function(row){
          this.$refs.tableTree.setCurrentRow({})
          var children = this.tableTreeData.filter(function(o,i){return o.SPDB_ParentOrgCode==row.SPDB_OrgCode})
          !function toogleExpandRow(self,children){
            for(var i=0;i<children.length;i++){
              var row = children[i]
              self.$refs.tableTree.toggleRowExpansion(row,false)
              var childRows = self.tableTreeData.filter(function(o,i){return o.SPDB_ParentOrgCode==row.SPDB_OrgCode})
              toogleExpandRow(self,childRows)
            }
          }(this,children)     
      },
      //展开节点 同时展开父节点
      openRowExpanded:function(row){
        this.$refs.tableTree.setCurrentRow(row)
        !function toogleRow(self,row){
            self.$refs.tableTree.toggleRowExpansion(row,true)
            var parentRow = self.tableTreeData.filter(function(o,i){return o.SPDB_OrgCode==row.SPDB_ParentOrgCode})
            if(parentRow.length>0){
              toogleRow(self,parentRow[0])
            }
        }(this,row)
      },
      rowDbClicl:function(row, column, event){
        if(row.leaf){
          window.xx = row
          alert(JSON.stringify(row))
        }else{
          this.$refs.tableTree.toggleRowExpansion(row)
        }
      },
      getTreeData:function(){
        this.tableData  = this.toTreeData(this.tableTreeData,'SPDB')
      }
    },
    mounted:function(){
      self = this
      window.vm = this
      this.$refs.tableTree.layout.gutterWidth = 0
      this.getTreeData()
    }
  }
</script>
<style>
.el-icon-arrow-right{
  vertical-align: unset !important;
  border:1px solid #8c8c8c;
  width: 10px;
  height: 11px;
  padding-right: 1px;
}
.el-icon-arrow-right:before {
  content: "\E6d9";
}
.el-table__expand-icon.el-table__expand-icon--expanded .el-icon-arrow-right:before{
  content: "\E6d8"
}
.el-table__expand-icon--expanded{
  -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
}
.fa.fa-dot-circle-o{
  margin-right: 5px;
}
.topSearchBar{
    position: absolute;
    right:15px;
    z-index:2;
}
.searchBar div{
    font-size:12px
}
.searchBar .el-input__inner{
    border-right: none;
    border-color: #EEEFF1;
}
.searchBar>.el-input>.el-input__inner{
    margin-left: -10px;
    padding-left: 20px;
    border:1px solid #eeeff1;
    border-right:none;
    border-left: none;
    width:260px;
    padding-right: 40px;
}

.searchBar .el-input-group__append{
    background-color: #fff;
}
.searchBar .el-input-group__prepend{
    border-radius: 20px;
    background-color: #1890FF;   
    border: 1px solid #1890FF;
}
.searchBar .el-input-group__append{
    border-radius: 20px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    border:1px solid #eeeff1;
    border-left: none;
    padding-left: 10px;
}
.searchBar .el-button{
    padding-left: 0px;
}

.searchBar .el-input__suffix{
    margin-right:5px;
}
</style>