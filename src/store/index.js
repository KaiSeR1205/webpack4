import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  //这里放全局参数
  state: {
    vmArr:{},
    version:'1.0.0'
  },
  //这里是set方法
  mutations: {    
    setVm(state,vm){
      for(var item in vm) state.vmArr[item] = vm[item]   
    },
    setVersion(state,version){
        state.version = version
    }
  },
  //这里是get方法  
  getters: {
    getVm: (state) => state.vmArr,
    getVersion : state => state.version
   },        
  //这个部分我暂时用不上
  actions: {
     setVm(context,v){
        context.commit("setVm",v)
     },
     setV(context){
       context.commit("setVersion","3.0.0")
     }
  },
  //这里是我自己理解的是为了给全局变量分组，所以需要写提前声明其他store文件，然后引入这里
  modules: {}
})
