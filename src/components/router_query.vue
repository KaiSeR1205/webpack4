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
      msg: this.$route.query.queryId
    }
  },
  mounted(){
    this.$store.state.vmArr['index'].msg = '通过store改变'
  }
}
</script>

<style scoped>

</style>
