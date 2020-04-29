<template>
    <div style="height:100%" v-loading="loading"> 
      <div style="position:relative;height:30px;margin-top:10px">
          <div class="topSearchBar searchBar">
              <el-input clearable size="mini" maxlength="200" :placeholder="searchPlaceholder"
                  @keyup.native.enter='searchEvent' v-model="orgSearch" style="width:380px">
                  <el-select size="mini" v-model="searchType" slot="prepend" style="color: #fff;width:100px">
                      <el-option label="产品查询" value="1"></el-option> 
                  </el-select>
                  <el-button slot="append" icon="el-icon-search" @click="searchEvent"></el-button>
              </el-input>
          </div> 
      </div>
     
      <div style="height:100%">
        <el-table
            ref="tableTree"
            height="85%"
            :data="tableData"
            style="width: 100%"
            row-key="SPDB_CategoryNo"
            :headerCellStyle='{background: "#198FFF",color: "#fff",fontWeight: "400"}'
            highlight-current-row
            border
            stripe
            lazy
            :load="lazyLoad"
            @row-dblclick	="rowDbClicl"
            :tree-props="{children: 'children',
                label: 'label',
                hasChildren: 'hasChildren'}">
            <el-table-column
              prop="SPDB_CategoryName"
              show-overflow-tooltip
              label="产品名称"
              width="300">
              <template slot-scope="scope">
                <span><i v-show="scope.row.SPDB_Level==6" class="fa fa-dot-circle-o"></i>{{scope.row.SPDB_CategoryName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="SPDB_CategoryNo"
              label="产品Id">
            </el-table-column>
          </el-table>
      </div>
      
    </div>
    </template>
    <script>
      import "css/basci-grid.css";
      import "css/font-awesome.css";
      import { getCascaderData } from "js/cascader-data.js";
      import { getCategoryData } from "js/category_data.js";
      var self = {}
      export default {
        data() {
          return {
            loading:false,
            searchType: "1",
            searchPlaceholder:"请输入产品id/产品名称",
            orgSearch: "",
            tableTreeData :getCategoryData(),
            tableData: []
          }
        },
    
        methods: {
          searchEvent:function(){
            //全部折叠 
            this.allExpanded(false)
            //找出数据链
            
            var targetNode = []   //查询结果的数据
            var nodeArr=[]        //查询结果的向上数据链 数组

            //按照产品编号内存里检索
            targetNode = this.tableTreeData.filter(function(o,i){
                return o.SPDB_CategoryNo == self.orgSearch
            })
            if(targetNode.length>0){
                nodeArr = this.getNodeParentArr(targetNode[0])
                nodeArr.forEach(function(o,i){
                    var row = o
                    var key = o.SPDB_CategoryNo
                    var data = self.findChild(row)
                    if(row.hasChildren){
                        self.$nextTick(function(){
                            self.treeResolve(row,key,data)
                        })
                    }      
                })
                this.$refs.tableTree.setCurrentRow(targetNode[0])
            }
          }, 
          getNodeParentArr:function(row){
            var nodes = [row]
            !function getNodeParent(self,row){
                var parentNode = self.tableTreeData.filter(function(o,i){return o.SPDB_CategoryNo==row.SPDB_ParentCategoryNo})
                if(parentNode.length>0) {
                    nodes.push(parentNode[0])
                    getNodeParent(self,parentNode[0])
                }
            }(this,row)
            return nodes.sort(function(a,b){return a.SPDB_Level-b.SPDB_Level})
          },
          //通过中文搜索机构
          searchOrgByLabel:function(){
              var node = this.tableTreeData.filter(function(o,i){
                  return o.SPDB_CategoryName.indexOf(self.orgSearch)>-1
              })
              return node
          },     
          //转换tree结构数据
          toTreeData: function(data, parentCategoryNo) {
            function tree(categoryNo) {
              var arr = [];
              data
                .filter(function(item){
                  return item.SPDB_ParentCategoryNo === categoryNo;
                })
                .forEach(function(item){
                  var t = tree(item.SPDB_CategoryNo);
                  if(t.length>0){
                    item.children = t
                  }
                  item.leaf = !t.length>0
                  arr.push(item);
                });
              return arr;
            }
            return tree(parentCategoryNo);
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
              var children = this.tableTreeData.filter(function(o,i){return o.SPDB_ParentCategoryNo==row.SPDB_CategoryNo})
              !function toogleExpandRow(self,children){
                for(var i=0;i<children.length;i++){
                  var row = children[i]
                  self.$refs.tableTree.toggleRowExpansion(row,false)
                  var childRows = self.tableTreeData.filter(function(o,i){return o.SPDB_ParentCategoryNo==row.SPDB_CategoryNo})
                  toogleExpandRow(self,childRows)
                }
              }(this,children)     
          },
          //展开节点 同时展开父节点
          openRowExpanded:function(row){
            this.$refs.tableTree.setCurrentRow(row)
            !function toogleRow(self,row){
                self.$refs.tableTree.toggleRowExpansion(row,true)
                var parentRow = self.tableTreeData.filter(function(o,i){return o.SPDB_CategoryNo==row.SPDB_ParentCategoryNo})
                if(parentRow.length>0){
                  toogleRow(self,parentRow[0])
                }
            }(this,row)
          },
          rowDbClicl:function(row, column, event){
            alert(JSON.stringify(row))
          },
          treeResolve:function(row,key,data){
            var _this = this.$refs.tableTree.store
            var _states = _this.states
            var treeData = _states.treeData
            var lazyTreeNodeMap = _states.lazyTreeNodeMap
            treeData[key].loading = false;
            treeData[key].loaded = true;
            treeData[key].expanded = true;
            if (data.length) {
                _this.$set(lazyTreeNodeMap, key, data);
            }
            _this.updateTreeData()
          },
          lazyLoad:function(tree, treeNode, resolve){
              debugger;
            var data = this.findChild(tree)
            var key = tree.SPDB_CategoryNo
            setTimeout(() => {
                resolve(data)
            }, 1000)
          },
          findChild:function(p){
            return this.tableTreeData.filter(function(o,i){
                return o.SPDB_ParentCategoryNo == p.SPDB_CategoryNo
            }).map(function(o,i){
                if(o.SPDB_Level<6) o.hasChildren = true
                return o
            })
          },
          getTreeData:function(){
            this.tableData  = this.tableTreeData
            .sort(function(a,b){return a.SPDB_CategoryNo-b.SPDB_CategoryNo})
            .filter(function(o,i){return o.SPDB_Level==1}).map(function(o,i){
                o.hasChildren = true
                return o
            })
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