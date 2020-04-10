<template>
  <div style="width:100%;height:100%">
    <div class="box align_center direction_colum" style="height:300px;padding-top:20px">
      <el-upload
        v-show="!word.show"
        :show-file-list="false"
        class="upload-demo"
        drag
        :action="action"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :before-upload="beforeUpload"
        :multiple="false"
      >
        <i v-show="!fileType.showError" class="iconfont iconWord"></i>
        <div v-show="fileType.showError" class="fileTypeError">
          <div>文件格式错误</div>
          <div class="fileTypeError_sub">只允许上传.doc格式文件</div>
        </div>
        <div class="el-upload__text">
          <el-button type="info" round>点击上传文件</el-button>
          <div v-show="!fileType.showError" class="upload-text">或将文件拖至文本框内</div>
        </div>
      </el-upload>
      <div class="word" v-show="word.show">
        <el-scrollbar>
          <el-input resize="none" v-model="word.content" type="textarea" class="wordContent"></el-input>
        </el-scrollbar>
      </div>
    </div>
    <div style="margin-top: 20px;text-align: center;">
      <el-button @click="uploadSubmit" :disabled="word.disabled" :type="word.disabled?'info':'primary'">确定上传</el-button>
    </div>
    <div>
      <el-dialog class="dialogForm" :visible.sync="dialogShow" center>
        <div slot="title">代发关系变更</div>
        <el-form ref="dengmiQueryForm" label-width="100px" size="mini" label-position="left">
           <el-row>
             <el-col :span="24">
                  <el-form-item label="西贝" class="firstItem" label-width="auto">
                    <div class="content">单位编号：09876890</div>
                  </el-form-item>
             </el-col>
           </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item class="contentGray" label="所属分行" label-width="80px">
                        <div class="content">98666-上海分行</div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item class="contentGray" label="所属支行" label-width="80px">
                        <div class="content">黄埔支行</div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item class="contentGray" label="签约机构" label-width="80px">
                        <div class="content">静安支行</div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item class="contentGray" label="代发开拓人" label-width="80px">
                       <div class="content">2344-张小三-上海分行</div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item class="contentGray" label="经营维护人" label-width="80px">
                        <div class="content">2344-张小三-上海分行</div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item class="contentGray" label="运营支撑人" label-width="80px">
                       <div class="content">2344-张小三-上海分行</div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="border-top: 1px dotted;padding-top: 20px;">
                  <el-col :span="24">
                    <el-form-item class="contentBlack" label="变更类型" label-width="80px">
                        <div class="content">
                          <span style="color:#B3B3B4">变更</span>
                          <span>代发拓展人</span>
                          <span style="color:#B3B3B4">为</span>
                          <span>: &nbsp;&nbsp;&nbsp;</span>
                          <span>2344-张小三-上海分行</span>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>  
           <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item class="contentBlack" label="变更原因" label-width="80px">
                        <div class="content">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</div>
                    </el-form-item>
                </el-col>
            </el-row>  
           <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item class="contentBlack" label="申请时间" label-width="80px">
                        <div class="content">2020-02-28</div>
                    </el-form-item>
                </el-col>
            </el-row>  
           <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item class="contentBlack" label="审批结果" label-width="80px">
                        <div class="content">
                           <el-radio-group>
                              <el-radio label="同意"></el-radio>
                              <el-radio label="拒绝"></el-radio>
                          </el-radio-group>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>   
           <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item class="contentBlack" label="审批结果" label-width="80px">
                        <div class="content">
                          <el-input resize="none"  placeholder="请输入原因，20个字符" maxlength="20" type="textarea"></el-input>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>            
            <el-row>
                <el-col :span="12" :offset="8">
                    <el-button style="width:200px" type="primary" >提交</el-button>
                </el-col>
            </el-row>
        </el-form>
      </el-dialog>
      
    </div>
  </div>
</template>

<script>
import "css/index.css";
import "css/font-awesome.css";
import "css/iconfont.css";
var self = {};
export default {
  name: "uploadDemo",
  data: function() {
    return {
      dialogShow:true,
      word: {
        show: false,
        content: "",
        disabled:true
      },
      fileType: {
        showError: false
      },
      action: "http://localhost:9090/upload"
    };
  },
  methods: {
    uploadSubmit:function(){
        vm.$alert(this.word.content,"内容",{showConfirmButton:false})
    },
    beforeUpload(file) {
      console.log(file);
      this.word.content=""
      var type = file.name.substring(file.name.lastIndexOf(".") + 1);
      var extension = type === "doc";
      if (!extension) {
        this.fileType.showError = true;
        return false;
      }
      this.fileType.showError = false;
      return true;
    },
    uploadSuccess: function(response, file, fileList) {
      this.word.content = "";
      if (response.type == "success") {
        this.word.show = true;
        this.word.content = response.content;
      } else {
        console.log(response.content);
        this.$message.error('文件解析失败:'+response.content);
      }
    },
    uploadError: function(err, file, fileList) {
      this.$message.error(typeof err == "object"?JSON.stringify(err):error);
    }
  },
  watch:{
     "word.content":function(n,o){
         this.word.disabled = n == ""
     }
  },
  beforeCreate() {
    window.vm = this;
    self = this;
  },
  mounted: function() {}
};
</script>

<style>
.fileTypeError {
  font-size: 20px;
  margin-top: 40px;
  margin-bottom: 16px;
  color: red;
}
.fileTypeError_sub {
  font-size: 14px;
  color: #bfbfbf;
}
.upload-text {
  font-size: 14px;
  color: #bfbfbf;
  margin-top: 15px;
}
.upload-demo {
  width: 50%;
  height: 100%;
}
.el-upload--text {
  width: 100%;
  height: 100%;
}
.el-upload-dragger {
  width: 100%;
  height: 100%;
}
.wordContent {
  height: 100%;
}

.wordContent > textarea {
  min-height: 100% !important;
}

.el-upload-dragger .iconfont.iconWord {
  font-size: 67px;
  color: #c0c4cc;
  line-height: 100px;
  opacity: 0.3;
}
.word {
  height: 100%;
  width: 50%;
}
.word > .el-scrollbar,
.word > .el-scrollbar__wrap,
.word > .el-scrollbar > .el-scrollbar__wrap .el-scrollbar__view {
  height: 100% !important;
}
.el-message-box{
    height:90%;
}
.el-message-box__content{
    height: 90%;
    overflow: auto;
}
.dialogForm .el-dialog{
  width:600px
}
.dialogForm .el-dialog__header{
  background-color: #1890ff;
  color:#fff
}
.dialogForm .el-row{
  margin: 0 auto !important;
  padding-left: 10px;
}
.dialogForm .firstItem .el-form-item__label{
  font-size:30px;
  color: #444;
  font-weight: 700;
}
.dialogForm .firstItem .el-form-item__label-wrap{
  margin: 0px 10px;
}
.dialogForm .el-dialog__close{
  color:#fff !important;
  font-size:22px
}
.dialogForm  .el-form-item__label{
  padding-right: 0px;
}
.dialogForm .content{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre;
  color:#444
}
.dialogForm .contentGray>.el-form-item__label{
  color:#B3B3B4
}
.dialogForm .contentBlack>.el-form-item__label{
  color:#444
}
.dialogForm .el-radio__inner{
  width: 18px !important;
  height: 18px !important;
}

</style>