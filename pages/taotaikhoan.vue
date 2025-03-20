<template>
  <v-app id="inspire">


        <v-row align="center" justify="center">
          <v-card class="elevation-12">
            <v-row>
              <v-col>
                <v-card-text style="width: 400px;">
                  <h1 class="text-center display-2 blue--text text--accent-3">
                    Tạo tài khoản
                  </h1>
                  <h4 class="text-center mt-4">-------------</h4>
                  <v-form>
                    <v-text-field
                    label="Họ tên"
                    v-model="name"
                    prepend-icon="mdi-account"
                    type="text"
                    color="blue accent-4"

                  />
                    <v-text-field
                      label="Tài khoản"
                      v-model="username"
                      prepend-icon="mdi-account"
                      type="text"
                      color="blue accent-4"

                    />

                    <v-text-field
                      label="Mật khẩu"
                      :append-icon="showpassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showpassword ? 'text' : 'password'"
                      @click:append="showpassword = !showpassword"
                      v-model="password"
                      prepend-icon="mdi-lock"

                      color="blue accent-4"
                    />
                    <v-select
                    label="Quyền"
                    v-model="role"
                    :items="roleOptions"
                    prepend-icon="mdi-account"
                    color="blue accent-4"
                  ></v-select>
                  </v-form>
                </v-card-text>
                <div class="text-center mt-3">
                  <v-btn
                    rounded
                    color="blue accent-4"
                    dark
                    @click="fetchaddUser"
                    >Tạo tài khoản</v-btn
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
    name:'',
    username: '',apiUrl : process.env.API_BASE_URL,
    password: '',
    role: null,
      roleOptions: ["Admin", "User"],
    dialog: false,
    dialogMessage: '',
  }),
  props: {
    source: String,
  },
  created() {
  },
  methods: {

    async fetchaddUser() {
  try {
    const response = await this.$axios.post(`/insertaccount`, {
      name: this.name,
      username: this.username,
      password: this.password,
      role: this.role,
      nguoitao: this.$store.state.auth.user.Id
    });

    if (response.status === 200) {
      const successMessage = response.data.message;
      this.dialogMessage = successMessage;
      this.dialog = true;
      setTimeout(() => {
        this.dialog = false;
      }, 1500);
     this.name = ''
     this.username = ''
     this.password = ''
      this.role = ''
    }
    if (response.status === 404) {
      const successMessage = response.data.message;
      this.dialogMessage = successMessage;
      this.dialog = true;
      setTimeout(() => {
        this.dialog = false;
      }, 1500);
     this.name = ''
     this.taikhoan = ''
     this.matkhau = ''

    }
  } catch (error) {
    // Hiển thị dialog thông báo lỗi khi có lỗi từ server
    this.dialogMessage = error.response.data.error || 'Tên tài khoản đã tồn tại';
    this.dialog = true;
  }
    },
  },
}
</script>
