<template>
  <v-app>
    <v-app-bar app color="#1976D2" dark>
      <v-toolbar-title class="text-center">PHIẾU YÊU CẦU P.CNTT</v-toolbar-title>
      <v-menu
        offset-y
        v-if="isLoggedIn"
        style="
          z-index: 999 !important;
          left: 1022px;
          background: white !important;
        "
      >
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on" style="color: white">
            {{ Name }}
          </v-btn>
        </template>
        <v-list-item-group>
          <v-list-item @click="changePassword">
            <v-list-item-title class="not-selected"
              >Thông tin tài khoản</v-list-item-title
            >
          </v-list-item>
          <v-list-item @click="taokhachhang">
            <v-list-item-title class="not-selected"
              >Tạo khách hàng</v-list-item-title
            >
          </v-list-item>
          <v-list-item v-if="showAdministratorItem" @click="taotaikhoan">
            <v-list-item-title class="not-selected"
              >Tạo tài khoản</v-list-item-title
            >
          </v-list-item>
          <v-list-item @click="phieuyeucau">
            <v-list-item-title class="not-selected"
              >Phiếu yêu cầu</v-list-item-title
            >
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title class="not-selected"
              >Đăng xuất</v-list-item-title
            >
          </v-list-item>
        </v-list-item-group>
      </v-menu>
      <v-btn
        v-else
        text
        @click="goToLogin"
        class="ml-auto"
        style="color: white"
      >
        Đăng nhập
      </v-btn>
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>
<script>
export default {
  data() {
    return {
      showAdminListItem: false,
      showAdministratorItem: false,
      activeButton: '',
      Name: '',
      isLoggedIn: this.$store.state.auth.isLoggedIn,
    }
  },
  computed: {},
  created() {
    const isLoggedIn = this.$store.state.auth.isLoggedIn
    const userRole = this.$store.state.auth.user.Role

    if (isLoggedIn && userRole === 'Admin') {
      this.showAdminListItem = true
      this.showAdministratorItem = true
      this.Name = this.$store.state.auth.user.Name
    } else {
      this.showAdminListItem = true
      this.Name = this.$store.state.auth.user.Name
    }
    if (!isLoggedIn) {
      this.$router.push('/')
    } else {
      this.$router.push('/phieuyeucau')
      this.Name = this.$store.state.auth.user.Name
    }
  },
  methods: {
    taotaikhoan() {
      this.$router.push('/taotaikhoan')
    },
    taokhachhang(){
      this.$router.push('/taokhachhang')
    },
    showList(button) {
      this.activeButton = button
    },
    changePassword() {
      this.$router.push('/thongtintaikhoan')
    },
    phieuyeucau() {
      this.$router.push('/phieuyeucau')
    },
    logout() {
      this.$router.push('/')
      this.$store.commit('auth/logout')
      this.isLoggedIn = false
    },
    goToLogin() {
      this.$router.push('/login')
    },
  },
}
</script>
<style>
.v-application {
  font-family: 'Times New Roman', Times, serif;

  font-weight: 200;
  display: flex;
  position: relative;
}
.v-application .ml-auto {
}
html {
  font-size: 14px;
  overflow-x: hidden;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.v-toolbar__content,
.v-toolbar__extension {
  align-items: center;
  display: flex;
  position: relative;
  z-index: 0;
  justify-content: space-between;
}

.v-menu__content {
  z-index: 999 !important;
  background: white !important;
}
</style>
<style scoped>
#app {
  /* Set the background color to white */
  color: white;
}

#app-bar,
#navigation {
  background-color: #0d47a1 !important;
  color: white !important;
}
.custom-title {
  color: white;
}
.not-selected {
  color: black !important;
}
</style>
