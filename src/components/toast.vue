<template>
  <transition name="el-fade-in">
    <div class="toast" v-show="show">{{message}}</div>
  </transition>
</template>
<script>
export default {
  data: function() {
    return {
      show: false,
      message: "",
      delay: 1600
    };
  }
};
</script>

<style scoped>
    .toast {
        position: fixed;
        z-index: 9999;
        left: 50%;
        top: 45%;
        transition: all 1.5s;
        -webkit-transform: translateX(-50%) translateY(-50%);
        -moz-transform: translateX(-50%) translateY(-50%);
        -ms-transform: translateX(-50%) translateY(-50%);
        -o-transform: translateX(-50%) translateY(-50%);
        transform: translateX(-50%) translateY(-50%);
        text-align: center;
        border-radius: 50px;
        color: #fff;
        background: rgba(17, 17, 17, 0.7);
        height: 45px;
        line-height: 45px;
        padding: 0 15px;
        min-width: 100px;
    }
</style>