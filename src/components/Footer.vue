<template>
  <div id="footer-container">
    <div id="terms-and-conditions">
      <a href="javascript:void(0)" id="tnp-link"> Terms&Conditions| Privacy policy</a>
    </div>

  </div>
</template>

<script>
export default {
  name: "Footer"
}
</script>

<style scoped>
#footer-container{
  position: sticky;
  background: #FFFFFF;
  bottom: 0px;
  margin-left: 100px;
}
#terms-and-conditions {
  padding: 22px 0px 22px 0px;
}

#tnp-link {
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;

  color: #005B96;
}
</style>
