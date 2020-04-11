<template>
  <div style="height:100%">111</div>
</template>

<script>
import "css/index.css";
import "css/font-awesome.css";
import "css/iconfont.css";
import "css/basci-grid.css";
import basciGrid from "@/basci-grid.vue";

export default {
  name: "test",
  components: {
    basciGrid
  },
  data: function() {
    return {};
  },
  watch: {},
  methods: {},
  beforeCreate: function() {
    window.vm = this;
  },
  mounted: function() {}
};
</script>

<style>
</style>