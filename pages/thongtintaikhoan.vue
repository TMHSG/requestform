<template>
  <v-app id="inspire">


        <v-row align="center" justify="center">
          <v-card class="elevation-12">
            <v-row>
              <v-col>
                <v-card-text class="mt-12">
                  <h1 class="text-center display-2 blue--text text--accent-3">
                    Thông Tin Tài Khoản
                  </h1>
                  <h4 class="text-center mt-4">-------------</h4>
                  <v-form>
                    <v-text-field
                      label="Tài khoản"
                      v-model="taikhoan"
                      prepend-icon="mdi-account"
                      type="text"
                      color="blue accent-4"
                      :readonly="true"
                    />

                    <v-text-field
                      label="Mật khẩu cũ"
                      :append-icon="showpassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showpassword ? 'text' : 'password'"
                      @click:append="showpassword = !showpassword"
                      v-model="matkhau"
                      prepend-icon="mdi-lock"

                      color="blue accent-4"
                    />
                    <v-text-field
                      label="Mật khẩu mới"
                      :append-icon="shownewpassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="shownewpassword ? 'text' : 'password'"
                      @click:append="shownewpassword = !shownewpassword"
                      v-model="resetmatkhau"
                      prepend-icon="mdi-lock"

                      color="blue accent-4"
                      @keypress.enter="changePassword"
                    />
                  </v-form>
                </v-card-text>
                <div class="text-center mt-3">
                  <v-btn
                    rounded
                    color="blue accent-4"
                    dark
                    @click="changePassword"
                    >Đổi mật khẩu</v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-row>
        <v-dialog v-model="dialog" max-width="400">
          <v-card>
            <v-card-title class="headline">Thông báo</v-card-title>
            <v-card-text>
              {{ dialogMessage }}
            </v-card-text>
            <v-card-actions>
              <v-btn color="blue accent-4" @click="dialog = false">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

  </v-app>
</template>

<script>
export default {
  data: () => ({
    showpassword: false,
    shownewpassword: false,
    taikhoan: '',
    matkhau: '',
    resetmatkhau: '',apiUrl : process.env.API_BASE_URL,
    dialog: false,
    dialogMessage: '',
  }),
  props: {
    source: String,
  },
  created() {
    this.taikhoan = this.$store.state.auth.user.UserName
  },
  methods: {
    async changePassword() {
      try {
        const response = await this.$axios.put(
          `/updatepassword/${this.taikhoan}`,
          {
            taikhoan: this.taikhoan, // sử dụng tên tài khoản từ dữ liệu Vue
            matkhau: this.matkhau, // sử dụng mật khẩu từ dữ liệu Vue
            resetmatkhau: this.resetmatkhau,
          },
          { validateStatus: false }
        )

        if (response.status === 404) {
          const errorMessage = response.data.message
          // Xử lý thông báo lỗi ở đây (hiển thị trong dialog, alert, vv.)
          this.dialogMessage = errorMessage
          this.dialog = true
          setTimeout(() => {
            this.dialog = false
          }, 3000)
          return
        }
        if (response.status === 400) {
          const errorMessage = response.data.error
          // Xử lý thông báo lỗi ở đây (hiển thị trong dialog, alert, vv.)
          this.dialogMessage = errorMessage
          this.dialog = true
          setTimeout(() => {
            this.dialog = false
          }, 3000)
          return
        }
        if (response.status === 200) {
          const userInfo = response.data
          // Gọi mutation để cập nhật thông tin người dùng vào Vuex
          this.matkhau = ''
          this.resetmatkhau = ''
          this.dialogMessage = 'Đổi mật khẩu thành công'
          this.dialog = true
          setTimeout(() => {
            this.dialog = false
          }, 1000)
        }
        // Xử lý dữ liệu nhận được sau khi đăng nhập thành công
        // Chuyển hướng hoặc xử lý dữ liệu nhận được từ server sau khi đăng nhập thành công
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error(error)
      }
    },
  },
}
</script>
<style>

</style>
