<template>
          <el-tooltip ref="myToolTip" :placement="placement"
            :disabled="disabled"
            :effect="effect"
            :offset="offset"
            :transition="transition"
            :visibleArrow="visibleArrow"
            :popperOptions="popperOptions"
            :openDelay="openDelay"
            :manual="manual"
            :popperClass="popperClass"
            :enterable="enterable"
            :hideAfter="hideAfter"
            :tabindex="tabindex"
          >
            <div slot="content">
              <slot name="contentExt"></slot>
            </div>
            <div class="over-flow"  @mouseleave="onMouseLeave($event)" @mouseenter="onMouseOver($event)">
              <span ref="myToolTipRef">
                 <slot name="desc"></slot>
              </span>
            </div>
          </el-tooltip>
</template>
<script>
export default {
 name: 'ellipsis-tooltip',
    props: {
      content: {
        type: String,
        default: () => {
          return ''
        }
      },
      placement: {
        placement: String,
        default: () => {
          return 'top'
        }
      },      
      effect: {
        type: String,
        default: 'dark'
      },
      disabled:{
        type:Boolean,
        default:false
      },
      offset:{
        type:Number,
        default:0
      },
      transition:{
        type:String,
        default:'el-fade-in-linear'
      },
      visibleArrow:{
        type:Boolean,
        default:true
      },
      popperOptions:{
        type:Object,
        default() {
          return {
            boundariesPadding: 10,
            gpuAcceleration: false
          };
        }
      },
      openDelay: {
        type: Number,
        default: 0
      },
      manual:{
        type:Boolean,
        default:false      
      },
      popperClass:String,
      enterable:{
        type:Boolean,
        default:true      
      },
      hideAfter:{
        type: Number,
        default: 0     
      },
      tabindex:{
        type: Number,
        default: 0     
      }
    },
    data() {
      return {
        time:0
      }
    },
    methods: {
      onMouseOver(event){
        var _this = this
        let current = event.target
        let current_sub = this.$refs.myToolTipRef //offsetWidth
        if (current_sub.offsetWidth > current.offsetWidth) {
          clearTimeout(this.time)
          this.time = setTimeout(() => {
            _this.$refs.myToolTip.show()
          }, this.openDelay);
        }
      }
      ,
      onMouseLeave(event){
        clearTimeout(this.time)
        this.$refs.myToolTip.hide()
      }
    },
    mounted(){
      this.$refs.myToolTip.referenceElm.removeEventListener('mouseenter',this.$refs.myToolTip.show)
      this.$refs.myToolTip.referenceElm.removeEventListener('mouseleave',this.$refs.myToolTip.hide)
    }
}
</script>

<style scoped>
.over-flow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>