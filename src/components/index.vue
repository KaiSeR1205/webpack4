<template>
  <div>
      <div>
          <H1 class="alias">{{msg}}</H1>
          <div><img style="width:30px;height:30px" src="~img/icon-01.png"></div>
          <div><img style="width:30px;height:30px" :src="srcForImport"></div>
          <div><img style="width:30px;height:30px" :src="src"></div>       
      </div>
      
      <i class="el-icon-edit"></i><i class="el-icon-platform-eleme"></i><i class="el-icon-eleme"></i>
      <i class="el-icon-delete-solid"></i> <i class="el-icon-delete"></i>
      <div>storeVersion:{{$store.state.version}}</div>
      <div><el-button type="primary" @click="routerQuery_Click" icon="el-icon-check">routerQuery</el-button></div>
      <div><el-button type="primary" @click="routerParams_Click" icon="el-icon-check">routerPamras</el-button></div>
      <div><el-button type="primary" @click="getStoreVersion" icon="el-icon-check">getStoreVersion</el-button></div>
      <div><el-button type="primary" @click="setStoreVersion" icon="el-icon-check">setStoreVersion</el-button></div>
  </div>
</template>

<script>
import 'css/index.css'
import img from 'img/icon-01.png'
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'
import { mapActions } from 'vuex'
export default {
  name: 'index',
  data () {
    return {
      src :require("img/icon-01.png"),
      srcForImport:img,
      msg: 'demo'
    }
  },
  watch:{
    msg(){
      debugger;
      if(this.$store.state.vmArr['index'].msg!=""){
        this,msg = this.$store.state.vmArr['index'].msg
      }
    }
  },
  methods:{
    //映射store 里的action 为 this.method 方法 
    ...mapActions({
      setV:"setV"
    }),
    routerQuery_Click:function(){
　　　　this.$router.push({
　　　　  name: 'router_query',
         query:{queryId:'queryId'}
  　　 });
    },
    routerParams_Click:function(){
　　　　this.$router.push({ 
        name: 'router_params', 
        params: { paramId: 'paramId' },
        query:{queryId:'queryId'} 
      })
    },
    getStoreVersion(){
      this.$alert(this.$store.state.version)
    },
    setStoreVersion(){
      this.$store.commit('setVersion','2.0.0')
      this.getStoreVersion()
    }
  },
  mounted(){
    this.setV()
    this.$store.dispatch('setVm',{index:this})
  }
}
</script>

<style scoped>
div{
  margin-bottom:10px
}
</style>
