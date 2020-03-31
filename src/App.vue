<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style scoped>

#app {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
</style>
