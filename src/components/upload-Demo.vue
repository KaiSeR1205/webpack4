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
</style>