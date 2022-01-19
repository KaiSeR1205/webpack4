<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="(o,i) in tabs" :key="i" :label="o.label" :name="o.name"></el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
  import "css/index.css";
  import "css/basci-grid.css";
  var self = {};
  export default {
    name: "tabs",
    data: function () {
      return {
          tabs:[
              {label:'用户管理',name:'firstxx',desc:'dsdssd'},
              {label:'配置管理',name:'secondxx',desc:'都是对的'},
              {label:'角色管理',name:'thirdxx',desc:'颠三倒四多所多所'},
              {label:'定时任务补偿',name:'fourthxx',desc:'颠三倒四多所'}
          ],
          activeName: 'firstxx'
      }
    },
    provide:function(){
        return {
            tabData:this.tabs
        }
    },
    watch: {

    },
    beforeCreate:function(){
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    },

    beforeCreate() {
      window.vm = this;
    },
    mounted: function () {

    }
  };
</script>