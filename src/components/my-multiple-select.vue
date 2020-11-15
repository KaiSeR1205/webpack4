<template>
<div>
    <div v-show="visible" @click="visible=false" class="el-dialog__wrapper" style="z-index: 2000;"></div>
    <div :style="{width:width}">
        <!-- <el-popover
            placement="bottom-start"
            :width="getPopoverWith()"
            v-model="visible"
            :visible-arrow="visibleArrow"
            popper-class="my-mutiple-select"
            trigger="manual"> -->
            <div class="my-mutiple-select">
                <div @click="visible=!visible" class="pop">
                    <div class="checkedValue">{{checkValue}}</div>
                    <div><i style="font-size:12px" :class="visible?'el-icon-arrow-up':'el-icon-arrow-down'"></i></div>
                </div>
                <div class="container" v-show="visible">
                    <div style="margin-bottom:5px"><el-input clearable v-model="searchText" @input="searchEvent" size="mini"></el-input></div>
                    <el-scrollbar ref="mtpSelScrollbar" :style="{height:height,width:'100%'}" :wrap-style="{height:height,width:'100%'}">
                    <div v-if="checkData.length>0"  class="checkbox_container">
                        <div class="checkbox_row" @click="allCheckEvent"><input :checked="checkedAll" type="checkbox" style="margin-right:5px"><span>全选</span></div>
                        <div class="checkbox_row" @click="getCheckValue(o)" v-for="(o,i) in checkData" :key="i"><input  :checked="o.checked" type="checkbox" style="margin-right:5px"><span>{{o[label]}}</span></div>
                    </div>
                    <div v-else style="text-align:center">无更多数据</div>    
                    </el-scrollbar>
                </div>
            </div>
        <!-- </el-popover> -->
    </div>
</div>
</template>
<script>
export default {
    name: "my-multiple-select",
    props:{
        label:{
            type: String,
            default:()=>{
                return 'label'
            }            
        },
        width:{
            type: String,
            required:true
        },
        data:{
            type: Array,
            required:true           
        },
        height:{
            type: String,
            default:()=>{
                return '200px'
            }      
        }
    },
        data:function(){
            return {
                checkValue:"",
                checkData:[],
                searchText:"",
                checkedAll:false,
                visible: false,
                options: [],           
                visibleArrow:false,
                scrollMemoryPer:0
            }
        },
        watch:{
            visible:function(n,o){
                if(n){
                    var t =  this.$refs.mtpSelScrollbar.moveY / this.scrollMemoryPer
                    this.$nextTick(function(){
                        this.$refs.mtpSelScrollbar.wrap.scrollTop = t
                        this.$refs.mtpSelScrollbar.update()
                    })
                    
                }else{
                    this.scrollMemoryPer = this.$refs.mtpSelScrollbar.moveY / this.$refs.mtpSelScrollbar.wrap.scrollTop
                }
            }
        },
        methods:{
            getCheckValue:function(obj){
                var _this = this
                obj.checked = !obj.checked
                this.checkValue = ""
                var tmp = []
                this.$nextTick(function(){
                    for(var i=0;i<this.checkData.length;i++){
                        if(_this.checkData[i].checked){
                            tmp.push(_this.checkData[i][_this.label])
                        }
                    }
                    _this.checkValue = tmp.join(', ')
                })
    
            },
            getSelectedData:function(){
                var data = this.checkData.filter(function(o){
                    return o.checked
                })
                console.log(data.length)
                return data
            },
            getPopoverWith:function(){
                return (parseInt(this.width.replace('px','')) - 10)
            },
            onSearch:function(data){
                this.checkData = data
            },
            searchEvent:function(){
                var _this = this
                this.checkValue = ""
                this.checkedAll = false
                this.checkData.forEach(function(o){
                    o.checked = false
                })
                console.log(this.searchText)
                this.$emit("mtpsearch",this.searchText,this.checkData,this.data);
                this.$nextTick(function(){
                    this.$refs.mtpSelScrollbar.wrap.scrollTop = 0
                    var vScroll = document.querySelectorAll('.my-mutiple-select .el-scrollbar__bar.is-vertical .el-scrollbar__thumb')[0]
                    vScroll.classList.remove('top');
                    vScroll.classList.remove('bottom');
                    this.$refs.mtpSelScrollbar.update()
                })
            },
            hasClass:function(el,className){
                return el.className.indexOf(className)>-1
            },
            allCheckEvent(){
                this.checkedAll = !this.checkedAll
                var _this = this
                this.checkValue = ""
                var tmp = []
                this.$nextTick(function(){
                    if(this.checkData.length>100){
                        setTimeout(() => {
                            for(let i=10,o,flag= _this.checkedAll;o=_this.checkData[i++];){
                                //console.log('z'+i)
                                o.checked = flag
                                if(flag){
                                    tmp.push(o[_this.label])
                                }                      
                            }
                            _this.checkValue = tmp.join(', ')                         
                        }, 500);

                        for(var i=0;i<=10;i++){
                           // console.log('y'+i)
                            let o=_this.checkData[i],
                                flag = _this.checkedAll
                            o.checked = flag
                            if(flag){
                                tmp.push(o[_this.label])
                            }                      
                        }
                         _this.checkValue = tmp.join(', ')
                    }else{
                        this.checkData.forEach((o)=>{
                            o.checked = _this.checkedAll
                            if(_this.checkedAll){
                                tmp.push(o[_this.label])
                            }
                        })
                        _this.checkValue = tmp.join(', ')
                    }

                    console.log(_this.checkValue)
                })
                
            }
        },
        mounted:function(){
            var _this = this
            this.checkData = this.data
            // //重载滚动事件 
            var scrollbar = this.$refs.mtpSelScrollbar  
            var handleScroll = this.$refs.mtpSelScrollbar.handleScroll
            var wrap = scrollbar.$refs.wrap
            var vScroll = document.querySelectorAll('.my-mutiple-select .el-scrollbar__bar.is-vertical .el-scrollbar__thumb')[0]
            scrollbar.handleScroll = function () {
                
                console.log('scrollTop:',wrap.scrollTop)
                console.log('scrollHeight:',wrap.scrollHeight)
                console.log('clientHeight:',wrap.clientHeight)
                console.log('scrollbar:',scrollbar)
                var hasBottom = _this.hasClass(vScroll,'bottom')
                var hasTop = _this.hasClass(vScroll,'top')
                //利用伪类 position:absolute top=0 和 bottom=0 控制滚动条置顶和置底 的显示错位
                 if ((wrap.scrollTop+wrap.clientHeight+30)>= wrap.scrollHeight) {
                    //如果滚动距离加容器高度 大于等于总高度 则 加上bottom样式 修复滚动到底部的错位
                    //如果滚动距离小于容器高度 则 加上top样式    修复滚动到顶部的错位
                   if (!hasBottom){
                        //vScroll.classList.remove('top');
                        vScroll.classList.add('bottom');
                        console.log('bottom')
                    }       
                }else if(wrap.scrollTop+30<=wrap.clientHeight){
                      if(hasBottom){
                        vScroll.classList.remove('bottom');
                        //vScroll.classList.add('top');   
                        console.log('top')
                    }              
                }
                // setTimeout(function() {
                   
                // }, 20);
                handleScroll.call(_this)
                
            }
            scrollbar.update()       
        }
}
</script>
