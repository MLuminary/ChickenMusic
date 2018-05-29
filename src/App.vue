<template>
  <div id="app">
    <MHeader />
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'

export default {
  components: {
    MHeader
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  #app
    color: $color-theme
</style>
