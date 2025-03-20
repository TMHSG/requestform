<template>
  <v-app id="inspire">


        <v-row align="center" justify="center">
          <v-card class="elevation-12">
            <v-row>
              <v-col>
                <v-card-text style="width: 400px;">
                  <h1 class="text-center display-2 blue--text text--accent-3">
                    Tạo khách hàng
                  </h1>
                  <h4 class="text-center mt-4">-------------</h4>
                  <v-form>
                    <v-text-field
                    label="Họ tên"
                    v-model="name"

                    type="text"
                    color="blue accent-4"

                  />
                    <v-text-field
                      label="Chức vụ"
                      v-model="chucvu"

                      type="text"
                      color="blue accent-4"

                    />

                    <v-text-field
                      label="Phòng ban"
                      v-model="phongban"
                      type="text"
                      color="blue accent-4"
                    />

                  </v-form>
                </v-card-text>
                <div class="text-center mt-3">
                  <v-btn
                    rounded
                    color="blue accent-4"
                    dark
                    @click="fetchaddUser"
                    >Tạo khách hàng</v-btn
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
    name:'',
    chucvu: '',
    phongban: '',
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
    const response = await this.$axios.post(`/insertkhachhang`, {
      name: this.name,
      chucvu: this.chucvu,
      phongban: this.phongban,
    });

    if (response.status === 200) {
      const successMessage = response.data.message;
      this.dialogMessage = successMessage;
      this.dialog = true;
      setTimeout(() => {
        this.dialog = false;
      }, 1500);
     this.name = ''
     this.chucvu = ''
     this.phongban = ''
    }
    if (response.status === 404) {
      const successMessage = response.data.message;
      this.dialogMessage = successMessage;
      this.dialog = true;
      setTimeout(() => {
        this.dialog = false;
      }, 1500);

    }
  } catch (error) {
    // Hiển thị dialog thông báo lỗi khi có lỗi từ server
    this.dialogMessage = error.response.data.error || 'lỗi';
    this.dialog = true;
  }
    },
  },
}
</script>
