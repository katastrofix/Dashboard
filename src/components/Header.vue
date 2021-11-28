<template>
  <div id="header-container">
    <div id="logo-container">
      <div id="logo-wrapper">
        <img src="../assets/images/logo.svg" alt="" id="logo">
      </div>
    </div>
    <div id="sidebar-toggler" @click="toggleSidebar">
      <span class="dsb-sidebar"><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
    </div>
    <div id="user-container">
      <div id="user-image">
        <img :src="userImage" v-if="userImage">
        <div v-else id="user-box">
          <span>{{ nameAbbreviation }}</span>
        </div>
      </div>
      <div id="user-name">
        <span>{{userName}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  computed: {
    nameAbbreviation: function () {
      return this.user ? this.user.firstName.substr(0, 1) + this.user.lastName.substr(0, 1) : '-'
    },
    userName:function (){
      return `${this.user?.firstName} ${this.user?.lastName}`;
    },
    user: function () {
      return this.$store.state.users[0]
    },
    sidebarOpen:function (){
      return this.$store.state.sidebarOpen
    }
  },
  mounted: function () {
    this.$store.dispatch('getUsers')
  },
  methods:{
    toggleSidebar:function (){
      this.$store.commit('setSidebarOpen', !this.sidebarOpen)
    }
  },
  data: () => {
    return {
      username: "John Doe",
      userImage: null
    }
  }
}
</script>

<style scoped>
#header-container {
  display: flex;
  padding: 21px 100px 21px 0px;
  align-items: center;
  border-bottom: 2px;
  border-color: #F3F6F9;
  border-style: solid;
}

#sidebar-toggler {
  display: flex;
  cursor: pointer;
  font-size: 27px
}


#logo-container {
  display: flex;
  width: 100px;
}

#user-container {
  display: flex;
  margin-left: auto;

}

#user-box {
  display: flex;
  background: #F6CA65;
  border-radius: 5px;
  width: 43px;
  height: 43px;
}

#user-name {
  margin-left: 11px;
  display: flex;
  align-items: center;
}

#user-name > span {
  color: #005B96;
  font-size: 16px;
  line-height: 19px;
  font-style: normal;
  font-weight: bold;
}

#user-box > span {
  font-size: 23px;
  line-height: 27px;
  margin: 8px;
  color: #FFFFFF;

}

#logo {
  padding: 0px 35px 0px 35px;
}
</style>
