<template>
  <div id="sidebar" v-bind:class="{'collapsed' : !sidebarOpen}">
    <div class="action">
      <span class="dsb-stats-off"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></span>
    </div>
    <div class="action">
      <span class="dsb-blocks-off"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></span>

    </div>
    <div class="action">
      <span class="dsb-computer-off"><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>

    </div>
    <div class="action" id="reports">
      <span class="dsb-pie-stats"><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
    </div>
    <div class="action">
      <span class="dsb-power-off"><span class="path1"></span><span class="path2"></span></span>

    </div>

  </div>
</template>

<script>
export default {
  name: "Sidebar",
  computed:{
    sidebarOpen:function (){
      return this.$store.state.sidebarOpen
    }
  }
}
</script>

<style scoped>
.collapsed{
  transform: translateX(-200px);
}
#sidebar{
  /*width: 100px;*/
  height: calc(100% - 132px);
  padding-left: 35px;
  padding-right: 40px;
  padding-top: 41px;
  margin-bottom: 61px;
  position: fixed;
  left: 0px;
  transition: all 0.5s ease-in-out;
}
.action{
  padding-bottom: 24px;
}
.action>span{
  font-size: 24px;
}

</style>
