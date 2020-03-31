<template>
  <div style="height:100%">
    <el-container class="orgContainer">
      <el-header>
          <div style="color:#409EFF;font-size:14px;display:flex">
              <div><i class="el-icon-circle-plus" style="margin-right:20px">新增机构</i></div>
               <div><i class="el-icon-s-custom" style="margin-right:20px">新建用户</i></div>
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

      </el-header>

      <el-container class="orgContainer">
        <el-aside> 
          <section class="el-drawer__body">
            <!-- <el-scrollbar style="height:90%"> -->
              <el-tree
                ref="orgTree"
                node-key="orgCode"
                :default-expanded-keys="defaultExpanded"
                accordion
                :data="orgData"
                :props="defaultProps"
                highlight-current
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
              ></el-tree>
            <!-- </el-scrollbar> -->
          </section>
        </el-aside>

        <el-main class="orgMain">
          <basci-grid
            ref="basciGrid"
            :config="grid"
            :pagination="pagination"
            @sort-change="loadData"
            @current-change="loadData"
          ></basci-grid>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import "css/basci-grid.css";
import { getCascaderData } from "js/cascader-data.js";
import basciGrid from "@/basci-grid.vue";
var self = {};
export default {
  name: "grid",
  components: {
    basciGrid
  },
  data: function() {
    return {
      searchType: "1",
      searchPlaceholder:"请输入机构号",
      defaultExpanded: [],
      orgSearch: "",
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      treeData: [],
      orgData:[],
      grid: {
        height: "90%",
        defaultSort: { prop: "date", order: "descending" },
        columns: [
          {
            prop: "date",
            label: "时间",
            align: "center",
            width: "180",
            sortable: "custom"
          },
          {
            prop: "desc",
            label: "描述",
            align: "center",
            sortable: "custom"
          }
        ],
        /*表格数据*/
        data: []
      },
      pagination: {
        currentPage: 1,
        pageSize: 20,
        layout: "prev, slot, next"
      },
      rightMenu: "",
      tmDisplay: false
    };
  },
  watch:{
      searchType:function(newValue,oldValue){
          if(newValue=="1"){
              this.searchPlaceholder = "请输入机构号或机构名称搜索"
          }else{
              this.searchPlaceholder = "请输入用户工号或者姓名搜索"
          }
      }
  },
  methods: {
    searchEvent:function(){
        if(this.searchType=="1"){
            //输入参数为空 则查找当前用户所在机构的下辖机构
            if(self.orgSearch==""){
                this.initTree("SPDB")
                return
            }
            //先按照机构号在内存里精准筛选 如果没找到则用机构名称匹配查找 
            var node = this.treeData.filter(function(o,i){
                return o.orgCode == self.orgSearch
            })
            if(node.length>0){
              debugger;
                //机构号精准查找
                this.initTree(self.orgSearch)
            }else{
               //机构名称匹配模糊查找 优先级为机构等级
               this.searchOrgByLabel()
            }
        }else{
            console.log('用户搜索:'+this.orgSearch)
        }
    },
    //通过中文搜索机构
    searchOrgByLabel:function(){
        var node = this.treeData.filter(function(o,i){
            return o.label.indexOf(self.orgSearch)>-1
        })
        if(node.length>0){
            node = node.sort(function(a,b){return a.level-b.level})
            if(node.length>1){
                var maxLevel = node[0].level
                self.orgData = node.filter(function(o,i){return o.level == maxLevel})
            }
        }else{
            self.orgData =[]
        }
    },
    //转换tree结构数据
    toTreeData: function(data, pOrgCode) {
      function tree(orgCode) {
        var arr = [];
        data
          .filter(function(item){
            return item.pOrgCode === orgCode;
          })
          .forEach(function(item){
            var t = tree(item.orgCode);
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
    //获取数据的方法里面可以是一个请求
    loadData: function(gridConfig, pageConfig) {
      console.log("当前页:", pageConfig.currentPage);
      console.log("排序字段:", gridConfig.sort.column);
      console.log("排序order:", gridConfig.sort.order);
      setTimeout(function() {
        gridConfig.data = [];
        if (pageConfig.currentPage < 90) {
          for (var i = 0; i < pageConfig.currentPage; i++) {
            gridConfig.data.push({
              id: i,
              date: "2020-04",
              desc: "那就看你就看就看就看" + i,
              qu: "大伤脑筋健康的数据库",
              address: "迦南科技电视剧的时间里"
            });
          }
          self.$nextTick(function() {
            gridConfig.data = gridConfig.data.sort(function(a, b) {
              return a.id - b.id;
            });
          });
        }
      }, 2000);
    },
    //节点点击事件
    handleNodeClick: function(data) {
      alert("选中机构号:" + data.orgCode);
    },
    //懒加载时查找子节点
    findChild: function(orgCode) {
      var data = this.treeData.filter(function(o, i) {
        return o.pOrgCode == orgCode;
      });

      data.forEach(function(o, i) {
        var children = self.treeData.filter(function(x, y) {
          return x.pOrgCode == o.orgCode;
        });
        o.children = children;
        o.leaf = !children.length > 0;
      });
      return data;
    },
    //获取机构数的数据
    getTreeData:function(){
      this.treeData = getCascaderData().map(function(o, i) {
        return {
          label: o.SPDB_OrgName + "(" + o.SPDB_OrgCode + ")",
          orgCode: o.SPDB_OrgCode,
          pOrgCode: o.SPDB_ParentOrgCode,
          level: o.SPDB_Lev
        };
      });
      this.treeData.push({
                label: "SPDB",
                orgCode: "SPDB",
                pOrgCode: "",
                level: 1
        })
    },
    //初始化树
    initTree: function(orgCode) {
      var label = ""
      var data = []
      if(orgCode=="SPDB"){
            data = {
                label: "SPDB",
                orgCode: "SPDB",
                pOrgCode: "",
                level: 1,
                children: [],
                leaf: true
            };
      }else{
        var node = this.treeData.filter(function(o,i){
             return o.orgCode == orgCode
         }) 
         if(node.length>0) {
            data = {
                label: node[0].label,
                orgCode: node[0].orgCode,
                pOrgCode: "",
                level: node[0].level,
                children: [],
                leaf: true
            };
         }else {
             this.orgData =[]
             return
         }
      }

      this.defaultExpanded.push(orgCode);

      var children =  this.toTreeData(this.treeData,orgCode)
      if(children.length>0){
          data.children = children
          data.leaf = false
      }
      this.orgData = [data]
    }
  },

  beforeCreate() {
    window.vm = this;
    self = this;
  },
  mounted: function() {
    this.getTreeData()
    this.initTree("SPDB")
    this.grid.data.push({
      id: 0,
      date: "2020-04",
      desc: "那就看你就看就看就看0"
    });
  }
};
</script>

<style>

.orgContainer .el-tree {
  height: 0;
}

.orgContainer .el-tree .el-tree-node__content {
  padding-right: 15px;
}
.orgContainer .el-tree > .el-tree-node {
  display: inline-block;
  min-width: 100%;
}
.orgContainer .el-header,
.el-footer {
  background-color: #fff;
  color: #333;
  padding: 10px 0 0 10px;
  height:45px !important
}
.el-drawer__body{
    height:100%;
    margin-top: 1px;
    border-top: 1px solid #eceef6;
}
.orgContainer .el-aside {
  background-color: #fff;
  color: #333;
  width: 300px;
  height: 90% !important;
  border-bottom: 1px solid #eceef6;
}

.orgMain {
  padding: 0;
  background-color: #fff;
}

.orgContainer {
  height: 95% !important;
}
.orgContainer .el-scrollbar {
  height: 90% !important;
  border-bottom: 1px solid #eceef6;
}
.orgContainer .el-scrollbar .el-scrollbar__wrap {
  width: 300px;
  border-top: 1px solid #eceef6;
  margin-top: 1px;
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