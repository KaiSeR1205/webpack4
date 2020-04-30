<template>
    <div style="height:100%" v-loading="loading">
        <el-card>
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
        <div id="tableTree">
            <el-table 
                ref="tableTree" 
                :border="false"
                size="small" 
                :height="treeHeight" 
                :data="tableData" 
                style="width: 100%" 
                row-key="SPDB_CategoryNo"
                :headerCellStyle='{background: "#198FFF",color: "#fff",fontWeight: "400"}' highlight-current-row 
                lazy :load="lazyLoad" @row-dblclick="rowDbClicl" @expand-change="expandChange" :tree-props="{children: 'children',
                label: 'label',
                hasChildren: 'hasChildren'}">
                <el-table-column class-name="enpandNode" width="400px" header-align="center" align="left" prop="SPDB_CategoryName" label="产品名称">
                    <template slot-scope="scope">
                        <el-tooltip :open-delay="400" :content="scope.row.SPDB_CategoryName" placement="top">
                            <span><i v-show="scope.row.SPDB_Level==6"
                                class="fa fa-dot-circle-o"></i>{{scope.row.SPDB_CategoryName}}</span>
                        </el-tooltip>
                        
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="SPDB_CategoryNo" label="产品Id">
                </el-table-column>
                <el-table-column align="center" label="积分系数">
                    <el-button size="small" type="text">编辑</el-button>
                </el-table-column>
            </el-table>
        </div>
        </el-card>
        <el-card>
            <div id="detailGrid">
                <basci-grid
                    ref="basciGrid"
                    :config="grid"
                    :pagination="pagination"
                >
                </basci-grid>  
            </div>
        </el-card>
    </div>
</template>
<script>
    import "css/basci-grid.css";
    import "css/font-awesome.css";
    import { getCascaderData } from "js/cascader-data.js";
    import { getCategoryData } from "js/category_data.js";
    import basciGrid from "@/basci-grid.vue";
    var self = {}
    export default {
        components: {
            basciGrid
        },
        computed:{
            treeHeight:function(){
               var height = (window.screen.availHeight*0.9-40-20)*0.48
               this.grid.height = (height-44)+'px'
               return height+'px'
            },
        },
        data() {
            return {
                treeLock:false,
                grid: {
                    size:"small",
                    height: '100%',
                    headerRowStyle: { minHeight: "30px", height: "30px" },
                    columns: [
                    {
                        prop: "date",
                        label: "时间",
                        align: "center",
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
                loading: false,
                searchType: "1",
                searchPlaceholder: "请输入产品id/产品名称",
                orgSearch: "",
                tableTreeData: getCategoryData(),
                tableData: []
            }
        },

        methods: {
            searchEvent: function () {
                //全部折叠 
                this.allExpanded()
                //找出数据链

                var targetNode = []   //查询结果的数据
                var nodeArr = []        //查询结果的向上数据链 数组

                //按照产品编号内存里检索
                targetNode = this.tableTreeData.filter(function (o, i) {
                    return o.SPDB_CategoryNo == self.orgSearch
                })
                if (targetNode.length > 0) {
                    nodeArr = this.getNodeParentArr(targetNode[0])
                    nodeArr.forEach(function (o, i) {
                        var row = o
                        var key = o.SPDB_CategoryNo
                        var data = self.findChild(row)
                        if (row.hasChildren) {
                            self.$nextTick(function () {
                                self.treeResolve(row, key, data)
                            })
                        }
                    })
                    this.$refs.tableTree.setCurrentRow(targetNode[0])
                }
            },
            //节点展开关闭事件
            expandChange: function (row, expanded) {
                //关闭父节点的同时关闭其子节点
                if (!expanded) {
                    this.closeRowExpadned(row)
                }else{
                    //每次只能打开一个根节点
                    if(row.SPDB_Level==1){
                        this.allExpanded()
                        this.$nextTick(function(){
                            this.$refs.tableTree.store.states.treeData[row.SPDB_CategoryNo].expanded = true
                        })  
                    }
                }
            },
            //获取指定节点的数据链
            getNodeParentArr: function (row) {
                var nodes = [row]
                !function getNodeParent(self, row) {
                    var parentNode = self.tableTreeData.filter(function (o, i) { return o.SPDB_CategoryNo == row.SPDB_ParentCategoryNo })
                    if (parentNode.length > 0) {
                        nodes.push(parentNode[0])
                        getNodeParent(self, parentNode[0])
                    }
                }(this, row)
                return nodes.sort(function (a, b) { return a.SPDB_Level - b.SPDB_Level })
            },
            //关闭节点 同时关闭子节点
            closeRowExpadned: function (row) {
                this.$refs.tableTree.setCurrentRow({})
                var treeData = this.$refs.tableTree.store.states.treeData
                !function toogleExpandRow(self, key) {
                    if(typeof treeData[key] !=='undefined'){
                        treeData[key].expanded = false
                        treeData[key].children.forEach(function (o, i) {
                            toogleExpandRow(self, o)
                        })
                    }
                }(this, row.SPDB_CategoryNo)
            },
            //全部折叠
            allExpanded: function () {
                this.$refs.tableTree.setCurrentRow({})
                var treeData = this.$refs.tableTree.store.states.treeData
                for (var node in treeData) {
                    if (treeData[node].expanded) treeData[node].expanded = false
                }
            },
            rowDbClicl: function (row, column, event) {
                debugger;
                var categoryNo = row.SPDB_CategoryNo,
                    store = this.$refs.tableTree.store
                //如果是打开状态 关闭节点 同时关闭子节点
                if(store.states.treeData[row.SPDB_CategoryNo].expanded){
                    this.closeRowExpadned(row)
                }else{    

                    if(!row.hasChildren) return 

                    //已经加载过节点了直接打开 
                    if(store.states.treeData[categoryNo].loaded){
                        this.$refs.tableTree.toggleRowExpansion(row,true)
                    }else{
                        //打开加载loading --> 找子节点 --> 加载数据 --> 关闭loading
                        store.states.treeData[categoryNo].loading = true
                        setTimeout(() => {
                            var children = this.findChild(row)
                            this.treeResolve(row,categoryNo,children)
                            store.states.treeData[categoryNo].loading = false  
                        }, 1000);
                        
                    }
                }
                
                //alert(JSON.stringify(row))
            },
            treeResolve: function (row, key, data) {
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
            lazyLoad: function (tree, treeNode, resolve) {
                if(this.treeLock) {
                    treeNode.loading = false
                    return
                }
                this.treeLock = true
                var data = this.findChild(tree)
                var key = tree.SPDB_CategoryNo
                setTimeout(() => {
                    self.treeLock = false
                    resolve(data)
                }, 1000)
            },
            findChild: function (p) {
                return this.tableTreeData.filter(function (o, i) {
                    return o.SPDB_ParentCategoryNo == p.SPDB_CategoryNo
                }).map(function (o, i) {
                    if (o.SPDB_Level < 6) o.hasChildren = true
                    return o
                })
            },
            getTreeData: function () {
                this.tableData = this.tableTreeData
                    .sort(function (a, b) { return a.SPDB_CategoryNo - b.SPDB_CategoryNo })
                    .filter(function (o, i) { return o.SPDB_Level == 1 }).map(function (o, i) {
                        o.hasChildren = true
                        return o
                    })
            }
        },
        beforeCreate() {
            self = this
            window.vm = this
        },
        mounted: function () {
            this.$refs.tableTree.layout.gutterWidth = 0
            this.getTreeData()
        }
    }
</script>
<style>
    body div,
    body span{
        font-size: 14px 
    }
    .el-card__body {
        padding:0px 20px;
    }
    .el-card{
        border: none;
    }
    .el-card.is-always-shadow{
        box-shadow: none;
    }
    #tableTree .is-left.enpandNode>div:first-child{
        margin-left: 35%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: pre;
    }
    #tableTree{
        margin: 10px 0px
    }
    #tableTree .el-button--small{
        padding: 0px 15px;
    }
    #tableTree .el-icon-arrow-right {
        vertical-align: unset !important;
        border: 1px solid #8c8c8c;
        width: 10px;
        height: 11px;
        padding-right: 1px;
    }

    #tableTree .el-icon-arrow-right:before {
        content: "\E6d9";
    }

    #tableTree .el-table__expand-icon.el-table__expand-icon--expanded .el-icon-arrow-right:before {
        content: "\E6d8"
    }

    #tableTree .el-table__expand-icon--expanded {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    #tableTree .fa.fa-dot-circle-o {
        margin-right: 5px;
    }

    .topSearchBar {
        position: absolute;
        right: 2px;
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
    #detailGrid .el-table__header tr,
    #detailGrid .el-table__header th {
    padding: 0;
    height: 40px;
    }
    #detailGrid .el-table__body tr,
    #detailGrid .el-table__body td {
    padding: 0;
    height: 40px;
    }
</style>