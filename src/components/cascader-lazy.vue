<template>
  <div>
    <div style="display:flex;margin-top:20px">
      <div style="margin-right:10px">所属分行</div>
      <div>
        <el-select
          style="width:150px"
          size="mini"
          v-model="fh.branchList.selectValue"
          @change="fhBranchChange"
          placeholder="全行"
        >
          <el-option
            v-for="(item,index) in fh.branchList.list"
            :key="index"
            :label="item.SPDB_OrgName"
            :value="item.SPDB_OrgCode"
          ></el-option>
        </el-select>
      </div>
      <div style="width:100px"></div>
      <div style="margin-right:10px">所属机构</div>
      <div style="position:relative">
        <el-cascader 
          :key="cascaderKey"
          @expand-change="expandChange"
          @visible-change = "visibleChange"
          style="width:500px" 
          ref="refHandle"
          size="mini" 
          v-model="fh.orgList.selectValue"
          :options="fh.orgList.list"
          expandTrigger="click"
          :props="props"
          :show-all-levels="false"
          >
          </el-cascader>
      </div>
    </div>
  </div>
</template>

<script>
var self = {};
window.laztLoadRs = null
import { getCascaderData } from "js/cascader-data.js";
export default {
  name: "cascader-lazy",
  data() {
    return {
      cascaderKey:'cascader',
      cascaderData: getCascaderData(),
      props: {
        value:"SPDB_OrgCode",
        label:"SPDB_OrgName",
        checkStrictly:true,
        emitPath:false,
        lazy: true,
        lazyLoad(node, resolve) {
          if(node.data){
            self.fh.orgList.selectValue = node.data.SPDB_OrgCode
            if(node.data.children && node.data.children.length>0){
              setTimeout(() => {
                resolve()
              }, 1000);
            }else{
              resolve()
            }
          }else{
            resolve()
          }
        }
      },
      fh: {
        branchList: {
          selectValue: "",
          list: []
        },
        orgList:{
          selectValue:"",
          list:[]
        }
      }
    };
  },
  methods: {
    visibleChange:function(show){
        if(show){
          var popper = self.$refs.refHandle.$refs.popper
          if(popper.$el) popper = popper.$el
          if(popper.getElementsByClassName('el-cascader-bottom-div').length==0){
            this.crteteDascaderDom()
          }
        }
    },
    crteteDascaderDom:function(){
      var div = document.createElement('div')
      div.className = 'el-cascader-bottom-div'
      var btnOk = document.createElement('button')
      btnOk.innerText="确定"
      btnOk.type="button"
      btnOk.className = 'el-button el-button--mini el-button--primary'
      btnOk.style.color="#fff"
      btnOk.onclick = function(){
         self.$refs.refHandle.dropDownVisible = false
      }
      var btnCancel = document.createElement('button')
      btnCancel.innerText="取消"
      btnCancel.type="button"
      btnCancel.style.color = '#409EFF'
      btnCancel.className = 'el-button el-button--mini el-button--default'
      btnCancel.onclick = function(){
         self.$refs.refHandle.dropDownVisible = false
      }
      div.appendChild(btnOk)
      div.appendChild(btnCancel)
      var popper = self.$refs.refHandle.$refs.popper
      if(popper.$el) popper = popper.$el
      popper.appendChild(div)
    },
    expandChange:function(){
        function postfixClick(){
            $(this).parent().find('.el-cascader-node__postfix').trigger("click")
        }
        this.$nextTick(function(){
            $('.el-cascader-panel .el-radio').unbind('click').bind("click",postfixClick)
        })
    },
    fhBranchChange:function(){  
      this.cascaderKey = "cascader"+this.fh.branchList.selectValue
      this.fh.orgList.list = [{
        SPDB_OrgName: "全部",
        SPDB_OrgCode: this.fh.branchList.selectValue,
        SPDB_BranchCode: "",
        SPDB_ParentOrgCode: "",
        SPDB_Lev: "",
        leaf:true
      }]
      this.fh.orgList.selectValue = ""
      var tree = this.toTreeData(this.cascaderData,this.fh.branchList.selectValue)
      this.fh.orgList.list =  this.fh.orgList.list.concat(tree)

      this.$nextTick(function(){
        this.expandChange()
      })
    },
    toTreeData: function(data, pOrgCode) {
      function tree(orgCode) {
        let arr = [];
        data
          .filter(item => {
            return item.SPDB_ParentOrgCode === orgCode;
          })
          .forEach(item => {
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
    loadBusinessUnit: function() {
      var buData = this.cascaderData;
      self.fh.branchList.list.push({
        SPDB_OrgName: "全行",
        SPDB_OrgCode: "spdb",
        SPDB_BranchCode: "",
        SPDB_ParentOrgCode: "",
        SPDB_Lev: ""
      });
      self.fh.branchList.list = self.fh.branchList.list.concat(self.cascaderData.filter(function(o,i){return o.SPDB_Lev==2}))
      self.fh.branchList.list.forEach(function(o) {
        if (o.SPDB_Lev == 2) o.SPDB_Lev = "";
      });
      self.fh.branchList.selectValue = 'spdb'
      this.fhBranchChange();
      this.fh.orgList.selectValue = "spdb"
    }
  },
  mounted() {
    self = this;
    window.vm = this;
    
    this.loadBusinessUnit();
  }
};
</script>

<style>
.el-cascader-panel .el-radio{
    width: 100%; 
    height: 100%;
    z-index: 10; 
    position: absolute; 
    top: 0; 
    left:0;
    pointer-events: all;
} 

.el-cascader-panel  .el-radio .el-radio__input{
    visibility: hidden;
} 
/*ie bug*/
.el-cascader-panel  .el-radio .el-radio__label{
    display: block;
    position: absolute; 
    right: 0;
    left: 0;
    background: #fff;
    opacity: 0;
    top:0;
    bottom:0;
    z-index:1;
} 
.el-cascader-panel .el-cascader-node__postfix{ 
    top: 10px; 
}
.el-cascader-panel label.el-radio.is-checked::before {
    content: "\e6da";
    font-family: element-icons!important;
    color: #409EFF;
    top: 10px;
    left: 10px;
    position: absolute;
    z-index:11;
}
.el-cascader-bottom-div{
    text-align: center;
    padding: 5;
    height: 20px;
    margin: 10px;
}
.el-cascader-bottom-div button{
    padding: 5px 10px;
}
.el-cascader-bottom-div .el-button+.el-button{
  margin-left: 5px;
}
</style>
