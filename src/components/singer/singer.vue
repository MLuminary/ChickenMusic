<template>
  <div class="singer">

  </div>
</template>

<script type="text/ecmascriot-6">
import { getSingerList } from 'api/singer'
export default {
  data() {
    return {}
  },
  mounted() {
    this._getSingerList()
  },
  methods: {
    _getSingerList() {
      getSingerList().then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
.singer
  position fixed
  top 88px
  bottom 0
  width 100%
</style>
