<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height bg">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="elevation-6">
              <v-window>
                <v-window-item :value="1">
                  <v-row>
                    <v-col cols="12">
                      <v-card-text class="mt-12">
                        <h1
                          class="text-center display-2 blue--text text--accent-3"
                        >
                          Đăng Nhập Request Ticket
                        </h1>
                        <h4 class="text-center mt-4">-------------</h4>
                        <v-form>
                          <v-text-field
                            label="Tài khoản"
                            v-model="taikhoan"
                            prepend-icon="mdi-account"
                            type="text"
                            color="blue darken-3"
                            @keypress.enter="signIn"
                          />

                          <v-text-field
                            label="Mật khẩu"
                            :append-icon="
                              showpassword ? 'mdi-eye' : 'mdi-eye-off'
                            "
                            :type="showpassword ? 'text' : 'password'"
                            @click:append="showpassword = !showpassword"
                            v-model="matkhau"
                            prepend-icon="mdi-lock"
                            color="blue darken-3"
                            @keypress.enter="signIn"
                          />
                        </v-form>
                      </v-card-text>
                      <div class="text-center mt-3">
                        <v-btn
                          rounded
                          color="blue darken-3"
                          dark
                          @click="signIn"
                          >Đăng nhập</v-btn
                        >
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
        <v-dialog v-model="dialog" max-width="400">
          <v-card>
            <v-card-title class="headline">Thông báo</v-card-title>
            <v-card-text>
              {{ dialogMessage }}
            </v-card-text>
            <v-card-actions>
              <v-btn color="green accent-4" @click="dialog = false">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <alert
        v-if="alert.visible"
        :message="alert.message"
        :type="alert.type"
      ></alert>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import alert from '~/components/alert'
export default {
  layout: 'login',
  components: {
    alert,
  },
  data: () => ({
    taikhoan: '',
    matkhau: '',
    showpassword: false,
    dialog: false,
    dialogMessage: '',
    backgroundImages: [],
    // Initial background image
    backgroundImg: '',
    alert: {
        visible: false,
        message: '',
        type: '',
      },
  }),
  props: {
    source: String,
  },
  async created() {},
  methods: {
    showAlert(message, type) {
      this.alert = {
        visible: true,
        message: message,
        type: type,
      }
      setTimeout(() => {
        this.alert.visible = false
      }, 3000)
    },
    async signIn() {
      const apiUrl = process.env.API_BASE_URL
      try {
        const response = await this.$axios.post(
          `/login`,
          {
            username: this.taikhoan.toLowerCase(), // sử dụng tên tài khoản từ dữ liệu Vue
            password: this.matkhau, // sử dụng mật khẩu từ dữ liệu Vue
          },
          { validateStatus: false }
        )
        if (response.status === 401) {
          const message = response.data.message

          // Xử lý thông báo lỗi ở đây (hiển thị trong dialog, alert, vv.)
          this.showAlert( `${message}`, 'error')
          setTimeout(() => {
            this.dialog = false
          }, 3000)
          return
        }
        if (response.status === 400) {
          const errorMessage = response.data.error
          // Xử lý thông báo lỗi ở đây (hiển thị trong dialog, alert, vv.)
          this.showAlert( `${errorMessage}`, 'error')

          setTimeout(() => {
            this.dialog = false
          }, 3000)
          return
        }
        if (response.status === 200) {
          const userInfo = response.data

          this.$store.commit('auth/SET_USER_INFO', userInfo)
          // Gọi mutation để cập nhật thông tin người dùng vào Vuex

         await this.$router.push('/phieuyeucau')
          console.log('gogo');
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>
<style scoped>
.bg {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

@media only screen and (max-width: 600px) {
  .bg {
    background-size: cover;
    background-position: center;
  }
}

.text-center {
  text-align: center;
}

.mt-3 {
  margin-top: 16px;
}

.mt-4 {
  margin-top: 32px;
}

.mt-12 {
  margin-top: 96px;
}
</style>
