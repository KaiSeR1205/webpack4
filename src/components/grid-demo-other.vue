<template>
  <div style="height:100%">
    <transition name="el-fade-in">
      <div class="toast" v-show="toastCfg.show">{{toastCfg.text}}</div>
    </transition>
    <basci-grid
      ref="basciGrid"
      :config="grid"
      :pagination="pagination"
      @sort-change="loadData"
      @current-change="loadData"
      @row-dbclick="rowDbClick"
    ></basci-grid>
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-table
        :show-header="false"
        style="width: 100%"
        :data="[
                {name:'张三丰',age:'101',address:'宽度定死多大点事所得到的',opetion:'操作',hover:{show:false,timeout:500}},
                {name:'张三丰1',age:'1·1',address:'发的方法对方',opetion:'操作2',hover:{show:false,timeout:500}}
              ]"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
      >
        <el-table-column prop="name" label="姓名" width="100"></el-table-column>
        <el-table-column prop="age" label="年龄" width="100"></el-table-column>
        <el-table-column prop="address" label="地址" width="200"></el-table-column>
        <el-table-column prop="opetion" label="操作" class-name="xx" width="120">
          <template slot-scope="scope">
            <span v-show="!scope.row.hover.show">{{scope.row.opetion}}</span>
            <div v-show="scope.row.hover.show">
              <i style="font-size:20px" class="el-icon-check" @click="checkIconClick(scope.row)"></i>
              <i style="font-size:20px" class="el-icon-close" @click="closeIconClick(scope.row)"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-form
        style="margin-top:20px"
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="ruleForm.age"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">提交</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import "css/basci-grid.css";
import PerfectScrollbar from "perfect-scrollbar";
import basciGrid from "@/basci-grid.vue";
var self = {};
export default {
  name: "grid",
  components: {
    basciGrid,
    PerfectScrollbar
  },
  data: function() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("年龄不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 18) {
            callback(new Error("必须年满18岁"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      toastCfg:{
        show:false,
        text: "操作成功"
      },
      dialogFormVisible: false,
      ruleForm: {
        pass: "",
        checkPass: "",
        age: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        age: [{ validator: checkAge, trigger: "blur" }]
      },
      subgrid: {
        height: "200px",
        defaultSort: { prop: "date", order: "descending" },
        columns: [
          {
            prop: "date",
            label: "时间",
            align: "center",
            width: "100"
          },
          {
            prop: "desc",
            label: "描述",
            showOverflowTooltip: false,
            align: "center"
          }
        ],
        /*表格数据*/
        data: [
          {
            id: 0,
            date: "2020-04",
            desc: "那就看你就看就看就看",
            qu: "大伤脑筋健康的数据库",
            address: "迦南科技电视剧的时间里"
          },
          {
            id: 0,
            date: "2020-04",
            desc: "那就看你就看就看就看",
            qu: "大伤脑筋健康的数据库",
            address: "迦南科技电视剧的时间里"
          },
          {
            id: 0,
            date: "2020-04",
            desc: "那就看你就看就看就看",
            qu: "大伤脑筋健康的数据库",
            address: "迦南科技电视剧的时间里"
          },
          {
            id: 0,
            date: "2020-04",
            desc: "那就看你就看就看就看",
            qu: "大伤脑筋健康的数据库",
            address: "迦南科技电视剧的时间里"
          },
          {
            id: 0,
            date: "2020-04",
            desc: "那就看你就看就看就看",
            qu: "大伤脑筋健康的数据库",
            address: "迦南科技电视剧的时间里"
          }
        ]
      },
      subPagination: {
        show: false
      },
      grid: {
        height: "90%",
        defaultSort: { prop: "date", order: "descending" },
        columns: [
          {
            prop: "date",
            label: "时间",
            align: "center",
            width: "100",
            sortable: "custom"
          },
          {
            // prop: "desc",
            label: "描述",
            align: "center",
            formatter: function(row, columns) {
              return self.formatterToolTip(self.$createElement, row, columns);
            },
            sortable: "custom"
          }
        ],
        /*表格数据*/
        data: []
      },
      pagination: {
        currentPage: 1,
        pageSize: 20,
        layout: "prev, pager, next",
        total: 1000
      }
    };
  },
  methods: {
    toast:function(text){
      var self = this
      this.toastCfg.show = true
      this.toastCfg.text = text  
      setTimeout(function() {
        self.toastCfg.show = false
      }, 1500);
    },
    checkIconClick: function(row) {
      this.toast("点击了checkIcon")
    },
    closeIconClick: function(row) {
      this.toast("点击了closeIcon")
    },
    cellMouseEnter: function(row, column, cell, event) {
      if (column.property == "opetion") {
        clearTimeout(row.hover.timeout);
        row.hover.timeout = setTimeout(() => {
          row.hover.show = true;
        }, 500);
      }
    },
    cellMouseLeave: function(row, column, cell, event) {
      if (column.property == "opetion") {
        clearTimeout(row.hover.timeout);
        row.hover.show = false;
      }
    },
    formatterToolTip: function(h, row, column) {
      return h(
        "el-tooltip",
        {
          props: {
            content: row.desc,
            placement: "top",
            effect: "light",
            openDelay: 400,
            value:true
          }
        },
        [h("div", {}, row.desc)]
      );
    },
    // slotButton_click:function(scope){
    //   console.log(scope)
    // },
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
    //行记录双击事件
    rowDbClick: function(row, column, event) {
      this.dialogFormVisible = !this.dialogFormVisible;
    }
  },
  beforeCreate() {
    window.vm = this;
    self = this;
  },
  mounted: function() {
    this.grid.data.push({
      id: 0,
      date: "2020-04",
      desc: "那就看你就看就看就看0"
    });

    window.p = require("perfect-scrollbar").default;
  }
};
</script>

<style>
.el-tooltip__popper.is-light[x-placement^="top"] .popper__arrow {
  border-top-color: #fff;
}
.el-tooltip__popper.is-light {
  border-color: #fff;
  box-shadow: 0px 4px 8px 0px #e5e5e5;
}
.toast {
  position: fixed;
  z-index: 9999;
  left: 50%;
  top: 45%;
  transition: all 1.5s;
  -webkit-transform: translateX(-50%) translateY(-50%);
  -moz-transform: translateX(-50%) translateY(-50%);
  -ms-transform: translateX(-50%) translateY(-50%);
  -o-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  text-align: center;
  border-radius: 5px;
  color: #fff;
  background: rgba(17, 17, 17, 0.7);
  height: 45px;
  line-height: 45px;
  padding: 0 15px;
  max-width: 150px;
}
.xx{
  color: red;
}
</style>