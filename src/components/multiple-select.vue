<template>
    <div style="margin:10px 0 0 30px">
        <myMultipleSelect ref="mtp" label="label" width="250px" :data="mtpSelData" eight="250px" @onSearch="onSearch"></myMultipleSelect>
        <div style="margin-top:30px"><el-button @click="getSelectedData" size="mini" type="primary">获取选中的值</el-button></div>
    </div>
</template>
<script>
import 'css/my-multiple-select.css'
import myMultipleSelect from "@/my-multiple-select.vue";
export default {
    name:"multiple-select",
    components:{
        /**
         * label:显示字段别名   string      默认值label
         * width:宽度          string      必填
         * data:数据源          Array      必填
         * height 多选框的高度  string    默认值200
         */
        myMultipleSelect
    },
    data(){
        return {
            mtpSelData:[]
        }
    },
    methods:{
        getSelectedData:function(){
            alert(JSON.stringify(this.$refs.mtp.getSelectedData()))
        },
        onSearch(searchText,cur,data){
            cur = data.filter(function(o){
                return o.label.indexOf(searchText)>-1
            })
           this.$refs.mtp.onSearch(cur)
        }
    },
    mounted(){
        window.vm = this
        for (var i = 0; i < 10000; i++) {
            this.mtpSelData.push({
                value:  i,
                label: (i%2?'黄金糕':'接收到接收到近段时间的时间里第十六届') + i,
                checked:false
            })
        }
    }
}
</script>