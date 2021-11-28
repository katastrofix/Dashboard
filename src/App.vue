<template>
 <div style="font-family: 'Roboto', sans-serif;" id="app-container">
    <Header></Header>
    <div class="border"></div>
    <Sidebar></Sidebar>
     <Reports></Reports>

    <Footer></Footer>
 </div>
</template>

<script>
import Vue from 'vue';
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import Reports from "@/components/views/Reports";

export default Vue.extend({
  name: 'App',
  components: {
    Header,
    Footer,
    Reports,
    Sidebar
  },
  computed: {},
  methods: {},


  data: () => ({

  }),
});
</script>
<style scoped>
#app-container{
  height: 100%;
}
@import url('http://fonts.cdnfonts.com/css/roboto');
</style>
<style>
html{
  height: 100%;
}
body {
  height: 100%;
  margin:0
}
#app-view{
  height: 100%;
}

</style>
