<template>
  <div style="height:100%">
    <el-container class="orgContainer">
      <el-header>
        <div class="flex-h" style="color:#409EFF;font-size:14px;">
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
        <div :style="{left:reduce.left}" class="reduce box align_center justify_center" @click="reduceClick"><i
            :class="reduce.icon"></i></div>

        <el-aside :style="{width:reduce.asideWidth}" v-loading="treeLoading">
          <section class="el-drawer__body">
            <el-scrollbar class="treeScroll">
              <el-tree ref="orgTree" accordion :props="defaultProps" node-key="orgCode" :data="orgData"
                :default-expanded-keys="defaultExpanded" highlight-current :expand-on-click-node="false">
              </el-tree>
            </el-scrollbar>
          </section>
        </el-aside>
        <el-main class="orgMain">
          <basci-grid ref="searchGrid" :pagination="pagination" :config="grid"></basci-grid>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  import "css/index.css";
  import "css/basci-grid.css";
  import { getCascaderData } from "js/cascader-data.js";
  import basciGrid from "@/basci-grid.vue";
  var self = {};
  export default {
    name: "grid",
    components: {
      basciGrid
    },
    data: function () {
      return {
        treeLoading: false,
        reduce: {
          icon: "el-icon-arrow-left",
          left: "260px",
          asideWidth: '250px',
          expand: true
        },
        searchType: "1",
        searchPlaceholder: "请输入机构号",
        defaultExpanded: [],
        orgSearch: "",
        defaultProps: {
          children: "children",
          label: "label",
          isLeaf: "leaf"
        },
        treeData: [],
        orgData: [],
        grid: {
          height: "90%",
          defaultSort: { prop: "date", order: "descending" },
          columns: [
            {
              prop: "date",
              label: "时间",
              align: "center",
              width: "180",
              sortable: false
            },
            {
              prop: "desc",
              label: "描述",
              align: "center",
              sortable: false
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
    watch: {
      searchType: function (newValue, oldValue) {
        if (newValue == "1") {
          this.searchPlaceholder = "请输入机构号或机构名称搜索"
        } else {
          this.searchPlaceholder = "请输入用户工号或者姓名搜索"
        }
      }
    },
    methods: {
      reduceClick: function () {
        if (this.reduce.expand) {
          this.reduce = {
            icon: "el-icon-arrow-right",
            left: "10px",
            asideWidth: "0px",
            expand: false
          }
        } else {
          this.reduce = {
            icon: "el-icon-arrow-left",
            left: "260px",
            asideWidth: "250px",
            expand: true
          }
        }
        this.$nextTick(function () {
          setTimeout(function () {
            self.$refs.searchGrid.updateScrollbar()
          }, 1100);
        })
      },
      searchEvent: function () {
        if (this.searchType == "1") {
          //输入参数为空 则查找当前用户所在机构的下辖机构
          if (self.orgSearch == "") {
            this.initTree("SPDB")
            return
          }
          //先按照机构号在内存里精准筛选 如果没找到则用机构名称匹配查找 
          var node = this.treeData.filter(function (o, i) {
            return o.orgCode == self.orgSearch
          })
          if (node.length > 0) {
            //机构号精准查找
            this.initTree(self.orgSearch)
          } else {
            //机构名称匹配模糊查找 优先级为机构等级
            this.searchOrgByLabel()
          }
        } else {
          console.log('用户搜索:' + this.orgSearch)
        }
      },
      //通过中文搜索机构
      searchOrgByLabel: function () {
        var node = this.treeData.filter(function (o, i) {
          return o.label.indexOf(self.orgSearch) > -1
        })
        if (node.length > 0) {
          node = node.sort(function (a, b) { return a.level - b.level })
          if (node.length > 1) {
            var maxLevel = node[0].level
            self.orgData = node.filter(function (o, i) { return o.level == maxLevel })
          }
        } else {
          self.orgData = []
        }
      },
      //转换tree结构数据
      toTreeData: function (data, pOrgCode) {
        function tree(orgCode) {
          var arr = [];
          data
            .filter(function (item) {
              return item.pOrgCode === orgCode;
            })
            .forEach(function (item) {
              var t = tree(item.orgCode);
              if (t.length > 0) {
                item.children = t
              }
              item.leaf = !t.length > 0
              arr.push(item);
            });
          return arr;
        }
        return tree(pOrgCode);
      },
      //获取数据的方法里面可以是一个请求
      loadData: function (gridConfig, pageConfig) {
        console.log("当前页:", pageConfig.currentPage);
        console.log("排序字段:", gridConfig.sort.column);
        console.log("排序order:", gridConfig.sort.order);
        setTimeout(function () {
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
            self.$nextTick(function () {
              gridConfig.data = gridConfig.data.sort(function (a, b) {
                return a.id - b.id;
              });
            });
          }
        }, 2000);
      },
      //节点点击事件
      handleNodeClick: function (data) {
        alert("选中机构号:" + data.orgCode);
      },
      //懒加载时查找子节点
      findChild: function (orgCode) {
        var data = this.treeData.filter(function (o, i) {
          return o.pOrgCode == orgCode;
        });

        data.forEach(function (o, i) {
          var children = self.treeData.filter(function (x, y) {
            return x.pOrgCode == o.orgCode;
          });
          o.children = children;
          o.leaf = !children.length > 0;
        });
        return data;
      },
      //获取机构数的数据
      getTreeData: function () {
        this.treeData = getCascaderData().map(function (o, i) {
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
      initTree: function (orgCode) {
        var label = ""
        var data = []
        if (orgCode == "SPDB") {
          data = {
            label: "SPDB",
            orgCode: "SPDB",
            pOrgCode: "",
            level: 1,
            children: [],
            leaf: true
          };
        } else {
          var node = this.treeData.filter(function (o, i) {
            return o.orgCode == orgCode
          })
          if (node.length > 0) {
            data = {
              label: node[0].label,
              orgCode: node[0].orgCode,
              pOrgCode: "",
              level: node[0].level,
              children: [],
              leaf: true
            };
          } else {
            this.orgData = []
            return
          }
        }

        this.defaultExpanded.push(orgCode);

        var children = this.toTreeData(this.treeData, orgCode)
        if (children.length > 0) {
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
    mounted: function () {
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
  .orgContainer .el-header,
  .el-footer {
    background-color: #fff;
    color: #333;
    padding: 10px 0 0 10px;
    height: 45px !important
  }

  .orgContainer .el-tree .el-tree-node__content {
    padding-right: 15px;
  }

  .orgContainer .el-tree>.el-tree-node {
    display: inline-block;
    min-width: 100%;
  }

  .orgContainer .el-drawer__body {
    height: 100%;
  }

  .orgContainer .treeScroll>.el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .orgContainer .el-main {
    padding: 0;
    overflow: hidden;
    -prefix-box-flex: 1 1 0%;
    -webkit-box-flex: 1 1 0%;
    -webkit-flex: 1 1 0%;
    -moz-box-flex: 1 1 0%;
    -ms-flex: 1 1 0%;
    flex: 1 1 0%;
  }

  .orgContainer .el-aside {
    color: #333;
    transition: width 1s;
    position: relative;
    height: 90% !important;
  }

  .orgContainer {
    height: 100% !important;
    padding: 10px;
  }

  .orgContainer .treeScroll.el-scrollbar {
    height: 100%;
    padding-bottom: 10px;
  }

  .content-main .el-card__body {
    padding: 10px;
    width: 100%
  }

  .orgContainer .el-table th {
    padding: 2px 0;
  }

  .orgContainer .el-tree-node__label {
    font-size: 13px;
  }

  .reduce {
    transition: left 1s;
    position: absolute;
    top: 40%;
    border: 1px solid #BDC5D0;
    border-radius: 100%;
    z-index: 99999;
    width: 20px;
    height: 20px
  }

  .reduce i {
    font-size: 12px;
  }

  .box {
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
  }

  .align_center {
    -webkit-box-align: center;
    -moz-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }

  .justify_center {
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
  }

  .topSearchBar {
    position: absolute;
    right: 15px;
    z-index: 2;
  }

  .searchBar div {
    font-size: 12px
  }

  .searchBar .el-input__inner {
    border-right: none;
    border-color: #EEEFF1;
  }

  .searchBar>.el-input>.el-input__inner {
    margin-left: -10px;
    padding-left: 20px;
    border: 1px solid #eeeff1;
    border-right: none;
    border-left: none;
    width: 260px;
    padding-right: 40px;
  }

  .searchBar .el-input-group__append {
    background-color: #fff;
  }

  .searchBar .el-input-group__prepend {
    border-radius: 20px;
    background-color: #1890FF;
    border: 1px solid #1890FF;
  }

  .searchBar .el-input-group__append {
    border-radius: 20px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    border: 1px solid #eeeff1;
    border-left: none;
    padding-left: 10px;
  }

  .searchBar .el-button {
    padding-left: 0px;
  }

  .searchBar .el-input__suffix {
    margin-right: 5px;
  }
</style>