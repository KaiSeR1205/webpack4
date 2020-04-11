<template>
  <div style="height:100%">
    <el-tabs v-loading="loading" class="mainTab" :style="{height:height}">
      <div style="padding-top: 10px;" class="flex-h noticTitle align_center">
        <div class="flex-h flex_1">
          <div class="newNoticCount">{{noticTitle.newNoticCount}}</div>
          <div class="notic_label">个新通知</div>
          <div
            @click="dialogApplyingVisible=true"
            style="height:40px"
            class="flex-h applyNotice"
            v-show="noticTitle.applyCount>0"
          >
            <div class="count">{{noticTitle.applyCount}}</div>
            <div class="label">个申请进行中</div>
          </div>
        </div>
        <div class="searchBar">
          <el-input :placeholder="search.placeholder" size="small" clearable v-model="search.value">
            <el-button
              slot="append"
              size="small"
              class="searchBtn"
              type="primary"
              @click="searchEvent"
            >搜索</el-button>
          </el-input>
        </div>
      </div>
      <div style="height:100%;padding-top:10px">
        <basci-grid
          ref="grid"
          :pagination="pagination"
          :config="grid"
          @row-dbclick="rowDbClick"
          @current-change="getGridData"
        ></basci-grid>
      </div>
      <div>
        <el-dialog
          class="dialogForm"
          :visible.sync="dialogFormVisible"
          :close-on-click-modal="false"
          center
        >
          <div slot="title">角色分配通知</div>
          <el-form label-width="100px" size="mini" label-position="left">

            <div v-show="formData.app_state>2">
              <div class="row flex-h" style="padding-left: 15px;">
                <div style="margin-right: 15px;">
                  <i :class="formData.app_state==3?'radius el-icon-check':'radius el-icon-close'" slot="label"></i>
                </div>
                <div style="font-size:12px">
                  <div class="label contentBlack" style="font-size:20px">{{formData.app_state==3?'审批已经通过':'审批未通过'}}</div>
                  <div class="label contentGray" style="color:#B3B3B4;line-height:15px">
                    <span>审批人/审批时间：</span>
                    <span class="label" style="color:#2d2dff">章三</span>
                    <span class="label contentGray">/</span>
                    <span class="label contentGray">2020-02-23 15:30</span>
                  </div>
                </div>
              </div>
              <div class="label contentBlack" style="padding-left:15px ;">
                  审批原因：XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
              </div>
            </div>

            <div class="flex-h align_center" style="height:60px" v-show="formData.app_state==2">
              <div class="applyTitle" style="margin-right:0px">申请待审批<span class="label contentGray">，</span></div>
              <div class="label contentGray">请耐心等待。</div>
            </div>
            <div class="mainForm">
              <div class="row" style="margin-bottom: 20px;">
                <span class="name">西贝</span>
                <span class="label contentBlack">90887633</span>
              </div>
              <div class="row flex-h">
                <div class="label contentBlack gutter">变更类型：</div>
                <div class="contentGray">变更</div>
                <div class="label contentBlack">代发拓展人</div>
                <div class="contentGray gutter">为</div>
                <div class="label contentBlack flex_1">2344-张小三-上海分行</div>
              </div>
              <div class="row flex-h">
                <div class="label contentBlack gutter">变更原因：</div>
                <div class="label contentBlack flex_1">XXXXXXXXXXXXXXXXXXXXXXXXXS</div>
              </div>
              <div class="row flex-h">
                <div class="label contentBlack gutter">申请时间：</div>
                <div class="label contentBlack flex_1">2020-02-20</div>
              </div>
              <div class="row approve .flex-v">
                <div class="splitDotted"></div>
                <div class="row flex-h flex_1">
                  <div class="flex-h align_center flex_1 rightFlexGutter">
                    <div class="label contentGray gutter">所属分行</div>
                    <div class="label contentBlack flex_1">98666-上海分行</div>
                  </div>
                  <div class="flex-h align_center flex_1 leftFlexGutter">
                    <div class="label contentGray gutter">所属支行</div>
                    <div class="label contentBlack flex_1">黄埔支行</div>
                  </div>
                </div>
                <div class="row flex-h flex_1">
                  <div class="flex-h align_center flex_1 rightFlexGutter">
                    <div class="label contentGray gutter">签约机构</div>
                    <div class="label contentBlack flex_1">静安支行</div>
                  </div>
                  <div class="flex-h align_center flex_1 leftFlexGutter">
                    <div class="label contentGray gutter">代发开拓人</div>
                    <div class="label contentBlack flex_1">2344-张小三-上海分行</div>
                  </div>
                </div>
                <div class="row flex-h flex_1">
                  <div class="flex-h align_center flex_1 rightFlexGutter">
                    <div class="label contentGray gutter">经营维护人</div>
                    <div class="label contentBlack flex_1">2344-张小三-上海分行dsdsddsdsdsdssdsddsdsds</div>
                  </div>
                  <div class="flex-h align_center flex_1 leftFlexGutter">
                    <div class="label contentGray gutter">运营支撑人</div>
                    <div class="label contentBlack flex_1">2344-张小三-上海分行dsdffddfdfdfdfdfdfdfdfdfdfdf</div>
                  </div>
                </div>
              </div>
            </div>
          </el-form>
        </el-dialog>
      </div>
      <div>
        <el-dialog
          width="80%"
          class="dialogApplying"
          :visible.sync="dialogApplyingVisible"
          :close-on-click-modal="false"
          center
        >
          <div slot="title">申请记录</div>
          <div class="flex-h">
            <div class="flex_1" style="text-align:left">
              <el-radio-group size="mini" v-model="tabStates">
                <el-radio-button label="0">全部</el-radio-button>
                <el-radio-button label="1">待审批</el-radio-button>
                <el-radio-button label="2">审批结束</el-radio-button>
              </el-radio-group>
            </div>
            <div>
              <el-input
                ref="applySearch"
                style="width:250px"
                size="mini"
                placeholder="请输入代发单位编号/名称"
                clearable
                v-model="applySearch"
              >
                  <i slot="suffix"  style="font-size:14px" class="el-input__icon el-icon-search" @click="applySearchEvent"></i>
              </el-input>
            </div>
          </div>
          <div style="height:100%;padding-top:10px">
            <basci-grid
              ref="searchGrid"
              :pagination="searchPagination"
              :config="searchGrid"
              @row-dbclick="rowDbClick"
              @current-change="getSearchGridData"
            ></basci-grid>
          </div>
        </el-dialog>
      </div>
    </el-tabs>
  </div>
</template>

<script>
import "css/index.css";
import "css/font-awesome.css";
import "css/iconfont.css";
import "css/allNotice.css";
import "css/basci-grid.css";
import basciGrid from "@/basci-grid.vue";
var self = {};
export default {
  name: "test",
  components: {
    basciGrid
  },
  data: function() {
    return {
      height: "600px", //窗体高度
      loading: true, //数据加载loading
      toastCfg: {
        //toast配置
        show: false,
        text: "",
        delay: 1600
      },
      noticTitle: {
        //顶部左边的通知信息
        newNoticCount: 3,
        applyCount: 2, //未处理待办
        treatedTask: 15, //已处理待办
        searchCount: 2, //搜索结果
        type: "basciColumns"
      },
      search: {
        //搜索栏配置
        placeholder: "请输入代发单位编号/名称",
        value: ""
      },
      gridType: "basciColumns", //grid配置列的属性名
      columnsCfg: {
        grid: [
          {
            prop: "type",
            label: "变更类型",
            align: "center",
            width: "150",
            formatter: this.formatterChangeType,
            resizable: false
          },
          {
            prop: "apr_name",
            label: "审批单号",
            align: "center",
            resizable: true
          },
          {
            prop: "substituteName",
            label: "代发单位名称",
            align: "center",
            resizable: true
          },
          {
            prop: "substituteCode",
            label: "代发单位编号",
            align: "center",
            resizable: true
          },
          {
            prop: "beforeOrg",
            label: "变更前",
            align: "center",
            resizable: true
          },
          {
            prop: "afterOrg",
            label: "变更后",
            align: "center",
            resizable: true
          },
          {
            prop: "app_createdOn",
            label: "申请时间",
            align: "center",
            resizable: false
          },
          {
            prop: "apr_approveTime",
            label: "审批时间",
            align: "center",
            resizable: false
          },
          {
            prop: "app_state",
            label: "申请状态",
            align: "center",
            formatter: function(row, coloum) {
              var h = self.$createElement;
              var cfg = { text: "", color: "" };
              if (row.app_state == 2) {
                cfg = { text: "待审批", color: "#f39700" };
              } else if (row.app_state == 3) {
                cfg = { text: "同意", color: "#74d980" };
              } else if (row.app_state == 4) {
                cfg = { text: "拒绝", color: "#f36a77" };
              }
              return h(
                "div",
                {
                  style: { color: cfg.color }
                },
                cfg.text
              );
            },
            resizable: false
          }
        ],
        searchGrid: [
          {
            prop: "type",
            label: "变更类型",
            align: "center",
            width: "150",
            formatter: this.formatterSearchChangeType,
            resizable: false
          },
          {
            prop: "apr_name",
            label: "审批单号",
            align: "center",
            resizable: true
          },
          {
            prop: "substituteName",
            label: "代发单位名称",
            align: "center",
            resizable: true
          },
          {
            prop: "substituteCode",
            label: "代发单位编号",
            align: "center",
            resizable: true
          },
          {
            prop: "beforeOrg",
            label: "变更前",
            align: "center",
            resizable: true
          },
          {
            prop: "afterOrg",
            label: "变更后",
            align: "center",
            resizable: true
          },
          {
            prop: "app_createdOn",
            label: "申请时间",
            align: "center",
            resizable: false
          },
          {
            prop: "apr_approveTime",
            label: "审批时间",
            align: "center",
            resizable: false
          },
          {
            prop: "app_state",
            label: "申请状态",
            align: "center",
            formatter: function(row, coloum) {
              var h = self.$createElement;
              var cfg = { text: "", color: "" };
              if (row.app_state == 2) {
                cfg = { text: "待审批", color: "#f39700" };
              } else if (row.app_state == 3) {
                cfg = { text: "同意", color: "#74d980" };
              } else if (row.app_state == 4) {
                cfg = { text: "拒绝", color: "#f36a77" };
              }
              return h(
                "div",
                {
                  style: { color: cfg.color }
                },
                cfg.text
              );
            },
            resizable: false
          }
        ]
      },
      grid: {
        //grid配置
        ref: "grid",
        height: "85%",
        tooltipEffect: "light",
        highlightCurrentRow: false,
        defaultSort: { prop: "", order: "" },
        columns: [],
        data: []
      },
      pagination: {
        //分页栏配置
        background: true,
        currentPage: 1,
        pageSize: 10,
        layout: "prev, slot, next"
      },
      searchGrid: {
        ref: "searchGrid",
        height: "200",
        tooltipEffect: "light",
        highlightCurrentRow: false,
        defaultSort: { prop: "", order: "" },
        columns: [],
        data: []
      },
      searchPagination: {
        currentPage: 1,
        show: false
      },
      dialogFormVisible: false, //表单弹出层开关
      dialogErrorVisible: false, //提交错误弹出层开关
      dialogApplyingVisible: false, //进行中的弹出层开关
      formData: {},
      dialogErrorData: {
        //提交错误弹出层数据
        title: "提交审批失败",
        reason: "原因：系统正在维护，请稍后再试！"
      },
      submit: {
        //提交按钮配置
        disabled: false
      },
      tabStates: "0", //申请中的弹出层tab
      applySearch: "" //申请中的弹出层tab 里的搜索框
    };
  },
  methods: {
    //设置总高度
    setMainHeight: function() {
      this.height = window.screen.availHeight * 0.8 + "px";
      //this.height = window.screen.availHeight * 0.75 + 'px'  替换
    },
    //toast弹出
    toast: function(text) {
      var self = this;
      this.toastCfg.show = true;
      this.toastCfg.text = text;
      setTimeout(function() {
        self.toastCfg.show = false;
      }, this.toastCfg.delay || 1600);
    },
    //变更类型
    formatterChangeType: function(row, column) {
      var h = this.$createElement;
      return h("div", {}, [
        row.isNew
          ? h("i", {
              class: ["fa fa-circle"],
              style: { color: "red", marginRight: "5px" }
            })
          : "",
        h("span", {}, row.type == 1 ? "关系所属变更" : "团队人员变更")
      ]);
    },
    //申请中的tab里grid的变更类型
    formatterSearchChangeType: function(row, column) {
      var h = this.$createElement;
      return h(
        "el-button",
        {
          props: {
            size: "mini",
            type: "primary"
          },
          class:["cleanhover"]
        },
        row.type == 1 ? "所属关系" : "团队人员"
      );
    },
    //搜索事件
    searchEvent: function() {
      this.loading = true;
      this.pagination.currentPage = 1;
      this.getGridData(this.grid, this.pagination);
    },
    //表单弹出层
    showDiaload: function(row) {
      this.submit.disabled = !(row.app_state == 2);
      this.dialogFormVisible = true;
    },
    //表单提交事件
    submitEvent: function() {
      console.log("submit:", this.formData);
      self.dialogFormVisible = false;
      this.toast("成功提交审批结果");
      this.getGridData(this.grid, this.pagination);
    },
    //进行中弹出层的search
    applySearchEvent:function(){
      this.getSearchGridData(this.searchGrid, this.searchPagination);
    },
    //表格双击事件
    rowDbClick: function(row, column, event) {
      this.formData = row
      this.showDiaload(row);
    },
    //gird切换columns
    setColumns: function(grid) {
      this[grid].columns = this.columnsCfg[grid];
    },
    //grid加载数据
    getGridData: function(gridConfig, pageConfig) {
      self.grid.data = [];
      this.$nextTick(function() {
        this.grid.showLoading(true);
        setTimeout(function() {
          for (var i = 0; i < 10; i++) {
            var data = {
              isNew: i < 3,
              type: parseInt(2 * Math.random()) + 1, //1:关系所属变更     2:团队人员变更
              apr_name: "488934958676900000000000",
              substituteCode: "81111101",
              substituteName: "代发单位1",
              branchOrg: "上海分行",
              currentOrg: "黄埔支行",
              app_reason: "XXXXXXXXXXXXXXXXXX",
              beforeOrg: "上海分行",
              afterOrg: "黄埔分行",
              app_createdOn: "2010.02.20",
              apr_approveTime: "2010.02.20",
              app_state: parseInt(3 * Math.random()) + 2 //2待审批  3同意  4不同意
            };
            self.grid.data.push(data);
          }
          self.loading = false;
        }, 2000);
      });
    },
    //searchGrid加载数据
    getSearchGridData: function(gridConfig, pageConfig) {
      self.searchGrid.data = [];
      this.$nextTick(function() {
        this.searchGrid.showLoading(true);
        setTimeout(function() {
          for (var i = 0; i < 10; i++) {
            var data = {
              isNew: i < 3,
              type: parseInt(2 * Math.random()) + 1, //1:关系所属变更     2:团队人员变更
              apr_name: "488934958676900000000000",
              substituteCode: "81111101",
              substituteName: "代发单位1",
              branchOrg: "上海分行",
              currentOrg: "黄埔支行",
              app_reason: "XXXXXXXXXXXXXXXXXX",
              beforeOrg: "上海分行",
              afterOrg: "黄埔分行",
              app_createdOn: "2010.02.20",
              apr_approveTime: "2010.02.20",
              app_state: parseInt(3 * Math.random()) + 2 //2待审批  3同意  4不同意
            };
            self.searchGrid.data.push(data);
          }
        }, 2000);
      });
    }
  },
  beforeCreate: function() {
    self = this;
    window.vm = this;
  },
  watch: {
    dialogApplyingVisible: function(n, o) {
      if (n) {
        this.tabStates = "1"
        this.applySearch=""
        this.setColumns("searchGrid");
        this.getSearchGridData(this.searchGrid, this.searchPagination);
      }
    },
    tabStates:function(n,o){
       this.setColumns("searchGrid");
       this.getSearchGridData(this.searchGrid, this.searchPagination);
    }
  },
  mounted: function() {
    this.setMainHeight();
    this.setColumns("grid");
    this.getGridData(this.grid, this.pagination);
  }
};
</script>

<style>
</style>