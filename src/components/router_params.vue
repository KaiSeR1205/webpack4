<template>
  <div>
      <div>
        {{msg}}
      </div>
  </div>
</template>

<script>
export default {
  name: 'first',
  data () {
    return {
      msg: this.$route.params.paramId
    }
  }
}
</script>

<style scoped>

</style>
