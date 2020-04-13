<template>
  <div style="height:100%">
   <transition name="el-fade-in">
        <div class="toast" v-show="toastCfg.show">{{toastCfg.text}}</div>
      </transition>
      <el-tabs v-loading="loading" class="mainTab" :style="{height:height}">
        <div class="flex-h taskTitle align_center">
          <div class="flex-h flex_1" v-if="taskTitle.type=='basciColumns'">
            <div class="untreatedTask">{{taskTitle.untreatedTask}}</div>
            <div class="taskTitle_label">个待办未处理，&nbsp;</div>
            <div class="taskTitle_label">已处理</div>
            <div class="treatedTask">{{taskTitle.treatedTask}}</div>
            <div class="taskTitle_label">个</div>
          </div>
          <div class="flex-h flex_1" v-else-if="taskTitle.type=='searchColumns'">
            <div class="untreatedTask">{{taskTitle.searchCount}}</div>
            <div class="taskTitle_label">个搜索结果</div>
          </div>
          <div class="searchBar">
            <el-input :placeholder="search.placeholder" size="small" clearable v-model="search.value" @clear="inputClear">
              <el-button slot="append" size="small" class="searchBtn" type="primary" @click="searchEvent">搜索</el-button>
            </el-input>
          </div>
        </div>
        <div style="height:100%;padding-top:10px">
          <basci-grid ref="grid" :pagination="pagination" :config="grid" @row-dbclick="rowDbClick"
            @current-change="getGridData"></basci-grid>
        </div>
        <div>
          <el-dialog class="dialogForm" :visible.sync="dialogFormVisible" :close-on-click-modal="false" center>
            <div slot="title">代发关系变更</div>
            <el-form ref="dengmiQueryForm" label-width="100px" size="mini" label-position="left">
              <div class="mainForm">
                <div class="row" style="margin-bottom: 20px;">
                  <span class="name">西贝</span>
                  <span class="label contentGray">单位编号：</span>
                  <span class="label contentBlack">90887633</span>
                </div>
                <div class="row">
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
                      <div class="label contentBlack flex_1">2344-张小三-上海分行</div>
                    </div>
                    <div class="flex-h align_center flex_1 leftFlexGutter">
                      <div class="label contentGray gutter">运营支撑人</div>
                      <div class="label contentBlack flex_1">2344-张小三-上海分行</div>
                    </div>
                  </div>
                </div>
                <div class="split"></div>
                <div>
                  <div class="row flex-h">
                    <div class="label contentBlack gutter">变更类型</div>
                    <div class="flex_1">
                      <span class="label contentGray">变更</span>
                      <span class="label contentBlack">代发拓展人</span>
                      <span class="label contentGray gutter">为 :</span>
                      <span class="label contentBlack">2344-张小三-上海分行</span>
                    </div>
                  </div>
                  <div class="row flex-h">
                    <div class="label contentBlack gutter">变更原因</div>
                    <div class="label contentBlack flex_1">XXXXXXXXXXXXXXXXXXXXXXXXXS</div>
                  </div>
                  <div class="row flex-h">
                    <div class="label contentBlack gutter">申请时间</div>
                    <div class="label contentBlack flex_1">2020-02-20</div>
                  </div>
                  <div class="row flex-h">
                    <div class="label contentBlack gutter">审批结果</div>
                    <div>
                      <el-radio-group v-model="formData.approveState">
                        <el-radio label="1">同意</el-radio>
                        <el-radio label="2">拒绝</el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                  <div class="row flex-h">
                    <div class="label contentBlack gutter">审批原因</div>
                    <div class="flex_1">
                      <el-input type="textarea" maxlength="20" resize="none" placeholder="请输入原因，20个字符"
                        v-model="formData.approveReason"></el-input>
                    </div>
                  </div>
                  <div style="text-align:center">
                    <el-button size="small" :disabled="submit.disabled" @click="submitEvent" style="width:200px"
                      type="primary">提交</el-button>
                  </div>
                </div>
              </div>
            </el-form>
          </el-dialog>
        </div>

        <div>
          <el-dialog class="dialogForm dialogError" :visible.sync="dialogErrorVisible" :close-on-click-modal="false"
            center>
            <div slot="title">代发关系变更</div>
            <div style="margin-top: 30px;margin-bottom: 80px;">
              <div class="contentBlack" style="margin-bottom: 20px;">{{dialogErrorData.title}}</div>
              <div class="contentGray">{{dialogErrorData.reason}}</div>
            </div>
            <div>
              <el-button size="small" @click="dialogErrorVisible=false" style="width:200px" type="primary">我知道了
              </el-button>
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
import "css/allToDotask.css";
import "css/basci-grid.css";
import basciGrid from "@/basci-grid.vue";
var self = {};
export default {
  name: "test",
  components: {
    basciGrid
  },
   data: function () {
          return {
            height: "600px", //窗体高度
            loading: true, //数据加载loading
            toastCfg: {
              //toast配置
              show: false,
              text: "",
              delay: 1600
            },
            taskTitle: {
              //顶部左边的task信息
              untreatedTask: 2, //未处理待办
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
            columns: {
              //grid 切换列的配置 basciColumns 、searchColumns
              basciColumns: [
                {
                  prop: "type",
                  label: "变更类型",
                  align: "center",
                  width: "150",
                  formatter: function (row, coloum) {
                    if (row.type == 1) return "关系所属变更";
                    else if (row.type == 2) return "团队人员变更";
                  }
                },
                {
                  prop: "apr_name",
                  label: "审批单号",
                  width: '180px',
                  align: "center"
                },
                {
                  prop: "substituteCode",
                  label: "代发单位编号",
                  align: "center"
                },
                {
                  prop: "substituteName",
                  label: "代发单位名称",
                  align: "center"
                },
                {
                  prop: "beforeOrg",
                  label: "变更前",
                  align: "center"
                },
                {
                  prop: "afterOrg",
                  label: "变更后",
                  align: "center"
                },
                {
                  prop: "app_createdOn",
                  label: "申请时间",
                  align: "center"
                },
                {
                  prop: "apr_approveTime",
                  label: "审批时间",
                  align: "center"
                },
                {
                  prop: "app_state",
                  label: "申请状态",
                  align: "center",
                  formatter: function (row, coloum) {
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
                  }
                },
                {
                  prop: "operate",
                  fixed: 'right',
                  label: "操作",
                  align: "center",
                  formatter: this.formatterOption,
                  resizable: false
                }
              ],
              searchColumns: [
                {
                  prop: "apr_name",
                  label: "审批单号",
                  width: '180px',
                  align: "center"
                },
                {
                  prop: "substituteName",
                  label: "代发单位名称",
                  align: "center"
                },
                {
                  prop: "substituteCode",
                  label: "代发单位编号",
                  align: "center"
                },
                {
                  prop: "branchOrg",
                  label: "所属分行",
                  align: "center"
                },
                {
                  prop: "currentOrg",
                  label: "所属支行",
                  align: "center"
                },
                {
                  prop: "type",
                  label: "变更类型",
                  align: "center",
                  formatter: function (row, coloum) {
                    if (row.type == 1) return "关系所属变更";
                    else if (row.type == 2) return "团队人员变更";
                  }
                },
                {
                  prop: "app_reason",
                  label: "变更原因",
                  align: "center"
                },
                {
                  prop: "app_state",
                  label: "申请状态",
                  align: "center",
                  formatter: function (row, coloum) {
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
                  }
                },
                {
                  prop: "operate",
                  fixed: 'right',
                  label: "操作",
                  align: "center",
                  formatter: this.formatterOption,
                  resizable: false
                }
              ]
            },
            grid: {
              //grid配置
              height: "85%",
              //tooltipEffect: "light",
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
            dialogFormVisible: false, //表单弹出层开关
            dialogErrorVisible: false, //提交错误弹出层开关
            formData: {
              //表单数据
              approveState: "",
              approveReason: ""
            },
            dialogErrorData: {
              //提交错误弹出层数据
              title: "提交审批失败",
              reason: "原因：系统正在维护，请稍后再试！"
            },
            submit: {
              //提交按钮配置
              disabled: false
            }
          };
        },
        methods: {
          //设置总高度
          setMainHeight: function () {
            //this.height = window.screen.availHeight * 0.75 + 'px'
            this.height = window.screen.availHeight * 0.8 + 'px'
          },
          //toast弹出
          toast: function (text) {
            var self = this;
            this.toastCfg.show = true;
            this.toastCfg.text = text;
            setTimeout(function () {
              self.toastCfg.show = false;
            }, this.toastCfg.delay || 1600);
          },
          //grid操作列
          formatterOption: function (row, column) {
            var h = this.$createElement;
            var iconNode = function (arrClass, arrStyle, event) {
              return h("i", {
                class: arrClass,
                style: arrStyle,
                on: event
              });
            };
            return h(
              "div",
              {
                class: ["flex-h"]
              },
              [
                h(
                  "div",
                  {
                    class: ["flex_1"]
                  },
                  [
                    iconNode(
                      ["el-icon-check", "iconOpeate"],
                      { display: row.app_state != 2 ? "none" : "" },
                      {
                        click: function () {
                          self.formData.approveState = "1";
                          self.showDiaload(row);
                        }
                      }
                    )
                  ]
                ),
                h(
                  "div",
                  {
                    class: ["flex_1"]
                  },
                  [
                    row.app_state == 2
                      ? iconNode(
                        ["el-icon-close", "iconOpeate"],
                        {},
                        {
                          click: function () {
                            self.formData.approveState = "2";
                            self.showDiaload(row);
                          }
                        }
                      )
                      : iconNode(
                        ["fa fa-list-ul", "iconOpeate"],
                        { fontSize: "17px" },
                        {
                          click: function () {
                            self.showDiaload(row);
                          }
                        }
                      )
                  ]
                )
              ]
            );
          },
          //搜索事件
          searchEvent: function () {
            this.gridType = this.search.value==""?"basciColumns":"searchColumns"
            this.loading = true;
            this.setColumns();
            this.taskTitle.type = this.gridType;
            this.pagination.currentPage = 1;
            this.getGridData(this.grid, this.pagination);
          },
          inputClear:function(){
            if(this.gridType=="searchColumns"){
               this.gridType="basciColumns"
               this.search.value=""
               this.searchEvent()
            }
          },
          //表单弹出层
          showDiaload: function (row) {
            this.submit.disabled = !(row.app_state == 2);
            self.dialogFormVisible = true;
          },
          //表单提交事件
          submitEvent: function () {
            console.log("submit:", this.formData);
            self.dialogFormVisible = false;
            this.toast("成功提交审批结果");
            this.getGridData(this.grid, this.pagination);
          },
          //表格双击事件
          rowDbClick: function (row, column, event) {
            this.showDiaload(row);
          },
          //gird切换columns
          setColumns: function () {
            this.grid.columns = this.columns[this.gridType];
          },
          //grid加载数据
          getGridData: function (gridConfig, pageConfig) {
            self.grid.data = [];
            this.$nextTick(function () {
              this.grid.showLoading(true);
              setTimeout(function () {
                for (var i = 0; i < 10; i++) {
                  var data = {
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
          }
        },
        beforeCreate: function () {
          self = this;
          window.vm=this
        },
        mounted: function () {
          this.setColumns();
          this.setMainHeight();
          this.getGridData(this.grid, this.pagination);
        }
};
</script>

<style>
</style>