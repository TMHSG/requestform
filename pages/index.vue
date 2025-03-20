<template>
  <v-app>
    <v-main>
      <v-container>
        <h3  style="color: red; text-align:center">Chú ý: Một người chỉ gửi được 2 lần trong vòng 15p </h3>
        <v-row justify="center" align="center">
          <v-col cols="12" sm="8" md="6">
            <v-card>
              <v-card-title>
                <h4 style="color: red; text-align:center">
                  Please provide your name / Vui lòng cung cấp tên quý khách*

                </h4>
              </v-card-title>
              <v-combobox
              label="Người lập"
              clearable
              background-color="amber lighten-4"
              color="orange orange-darken-4"
              v-model="selectedkhachhang"
              :items="listkhachhang"
              item-text="hovaten"
              :value="hovaten"
              dense
              outlined
              style="bottom: 10px !important"
            >
            <template #selection="{ item }">
              <div class="d-flex align-center">
                <div>{{ item.hovaten }}</div>
              </div>
            </template>
            <template #item="{ item }">
              <div class="d-flex align-center">
                <v-row>
                  <div>{{ item.hovaten }}</div>
                  <div>| <span>&nbsp;&nbsp;</span></div>
                  <div>{{ item.chucvu }}</div>
                  <div>| <span>&nbsp;&nbsp;</span></div>
                  <div>{{ item.phongban }}</div>

                </v-row>
              </div>
            </template>
            </v-combobox
          >

              <v-card-title>
                <h4 style="color: red; text-align:center">
                  Please provide your department / Vui lòng cung cấp khoa phòng*

                </h4>
              </v-card-title>
              <v-text-field
                outlined
                label="Khoa phòng tạo yêu cầu"
                v-model="Khoaphong"
                dense
                clearable
              ></v-text-field>

              <v-card-title>
                <h4 style="color: red; text-align:center">
                  Please provide your location ? Vui lòng cung cấp vị trí*

                </h4>
              </v-card-title>
              <v-radio-group v-model="radioGroup">
                <v-radio
                  label="CS01 - 9-15 Trịnh Văn Cấn Quận 1"
                  color="blue"
                  value="CS01 - 9-15 Trịnh Văn Cấn Quận 1"
                ></v-radio>
                <v-radio
                  label="CS02 - 6-8 Trịnh Văn Cấn Quận 1"
                  color="blue"
                  value="CS02 - 6-8 Trịnh Văn Cấn Quận 1"
                ></v-radio>
                <v-radio
                  label="CS03 - 1-3 Trịnh Văn Cấn Quận 1"
                  color="blue"
                  value="CS03 - 1-3 Trịnh Văn Cấn Quận 1"
                ></v-radio>
                <v-radio
                  label="CS04 - 441 Lê Văn Lương Quận 7"
                  color="blue"
                  value="CS04 - 441 Lê Văn Lương Quận 7"
                ></v-radio>
              </v-radio-group>
              <v-card-title>
                <h4 style="color: red; text-align:center">
                  Please provide your phone number? Số phone nội bộ (vd: 2313 hoặc 92310)*

                </h4>
              </v-card-title>
              <v-text-field
                outlined
                label="Số điện thoại"
                v-model="SoDienThoai"
                dense
                type="number"
                clearable
              ></v-text-field>
              <v-card-title>
                <h4 style="color: red; text-align:center">
                  Please provide problem's detail? Chi tiết vấn đề*

                </h4>
              </v-card-title>
              <v-textarea
                outlined
                v-model="ChiTiet"
                label="Chi tiết vấn đề"
              ></v-textarea>
              <v-card-title>
                <h4 style="color: red; text-align:center">
                  Chữ ký xác nhận*

                </h4>
              </v-card-title>
              <!-- Đoạn mã JavaScript của Signature Pad -->
              <v-card>
                <canvas ref="canvas" id="signature-pad"></canvas>
              </v-card>
              <v-divider />
              <v-row style="margin: 0">
                <v-btn @click="clearSignature">Xóa chữ ký</v-btn>
                <v-btn @click="sendrequest">Gửi yêu cầu</v-btn>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
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
import SignaturePad from 'signature_pad'
import alert from '~/components/alert'
export default {
  components: {
    alert,
  },
  data() {
    return {
      listkhachhang:[],
      hovaten:'',
      selectedkhachhang: null,
      radioGroup: null,

      Khoaphong:'',
      SoDienThoai: null,
      ChiTiet: '',
      signaturePad: null,
      requests: [],
      alert: {
        visible: false,
        message: '',
        type: '',
      },
    }
  },
  mounted() {
    this.initSignaturePad()
    this.setCanvasSize()
    this.getKhachhang()
    window.addEventListener('resize', this.setCanvasSize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.setCanvasSize)
  },

  methods: {
    async getKhachhang() {
      try {
        const response = await this.$axios.get(`/getkhachhang`)
        this.listkhachhang = response.data

      } catch (error) {
        console.error(error)
      }
    },
    sendrequest() {
      if (this.signaturePad.isEmpty()) {
        this.showAlert('Chữ ký không được để trống', 'error')
        return
      }
      const requestData = {
        hovaten: this.selectedkhachhang.hovaten,
        id_khachhang: this.selectedkhachhang.id,
        sodienthoai: this.SoDienThoai,
        chitiet: this.ChiTiet,
        chuky: this.signaturePad.toDataURL(),
        vitri: this.radioGroup,
        khoaphong: this.Khoaphong
      }

      this.$axios
        .$post(`/sendrequest`, requestData)
        .then((response) => {
         // console.log('Request sent successfully:', response)
          this.showAlert('Gửi yêu cầu thành công!', 'success')
          this.clearSignature()
          this.clearInformations()
        })
        .catch((error) => {

          let errorMessage = 'Gửi yêu cầu thất bại';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }

      this.showAlert(errorMessage, 'error');
        })
    },
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
    initSignaturePad() {
      const canvas = document.getElementById('signature-pad')
      this.signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)',
      })
    },
    setCanvasSize() {
      const canvas = this.$refs.canvas
      const vCard = canvas.parentElement

      canvas.width = vCard.clientWidth
    //  canvas.height = vCard.clientHeight * 1.8
    },
    clearSignature() {


      this.signaturePad.clear()
    },
    clearInformations(){
      this.hovaten = ''
      this.Khoaphong = ''
      this.selectedkhachhang = null
      this.SoDienThoai = ''
      this.ChiTiet = '',
      this.radioGroup= null

    }
  },
}
</script>

<style>
.text-center {
  text-align: center;
}
.signature-container {
  margin: 0 auto;
}
.signature-container canvas {
  display: block;
  width: 100% !important;
  height: auto !important;
}
</style>
