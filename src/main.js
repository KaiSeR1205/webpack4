import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import Toast from 'js/toast.js'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import "jquery";
Vue.use(Element)
Vue.use(Toast)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
Vue.mixin({
  beforeCreate: function () {
      console.log(this.$options._componentTag||"")
      if(this.$options._componentTag && this.$options._componentTag == "tab-nav"){
         var _render = this.$options.render
         this.$options.inject.tabData = {from:'tabData'}
         this.$options.render = function(h){
           var ret = _render.call(this,h)
           if(ret.children[0].children[0].children && ret.children[0].children[0].children.length>1){
             var nodes = ret.children[0].children[0].children
             for(var i=0;i<nodes.length;i++){
                var n = nodes[i]
                var key = ret.context.rootTabs.$children[i].name||""
                var flt = (ret.context.tabData||[]).filter((o,i)=>{return o.name === key && key === (n.key||"").replace('tab-','')})
                if(flt.length>0 && flt[0].desc && flt[0].desc.trim() != ""){
                  nodes[i] = h("el-tooltip",{props:{openDelay:300,content:flt[0].desc,placement:"bottom"}},[n])
                }
             }
           }
           return ret
         }
      }
  }
})