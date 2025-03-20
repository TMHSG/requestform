<template>
  <v-app>
    <v-container>
      <v-form @submit.prevent="saveChanges">
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="editedItem.hovaten"
              disabled
              label="Họ tên"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="editedItem.vitri"
              disabled
              label="Vị trí"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="editedItem.khoaphong"
              disabled
              label="Khoa phòng"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="editedItem.sodienthoai"
              label="Số điện thoại"
              disabled
            ></v-text-field>
          </v-col>
        </v-row>

        <v-textarea
          v-model="editedItem.chitiet"
          label="Chi tiết"
          disabled
        ></v-textarea>
        <v-row>
          <v-col cols="6">
            <div class="image-frame">
              <v-img
                v-if="ChuKy"
                :src="convertBase64ToImageUrl(ChuKy)"
                alt="Chữ ký"
                class="image-content"
                contain
              />
            </div>
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="editedItem.trangthai"
              :items="options"
              label="Select Option"
              outlined
            ></v-select>
          </v-col>
        </v-row>
        <v-textarea v-model="editedItem.lydo" label="Biện pháp khắc phục"></v-textarea>
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="editedItem.nguoicapnhat"
              label="Người cập nhật"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="editedItem.thoigiantao"
              label="Thời gian tạo"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="editedItem.thoigiancapnhat"
              label="Thời gian cập nhật"
              disabled
            ></v-text-field>
          </v-col>
        </v-row>
        <v-card>
          <v-card-title>
            <h4>Chữ ký xác nhận</h4>
          </v-card-title>
          <canvas ref="canvas" id="signature-pad"></canvas>
        </v-card>
        <v-divider />
        <v-row style="margin: 0">
          <v-btn @click="clearSignature">Xóa chữ ký</v-btn>
          <v-btn @click="saveChanges">Cập nhật</v-btn>
        </v-row>
        <!-- Thêm các trường khác tương tự -->
      </v-form>
      <alert
        v-if="alert.visible"
        :message="alert.message"
        :type="alert.type"
      ></alert>
    </v-container>
  </v-app>
</template>

<script>
import { vnDateTimeFormat } from '~/utils/formatday.js'
import SignaturePad from 'signature_pad'
import alert from '~/components/alert'
export default {
  components: {
    alert,
  },
  data() {
    return {
      options: [
        { text: 'Chưa xác nhận', value: 'Chưa xác nhận' },
        { text: 'Đang thực hiện', value: 'Đang thực hiện' },
        { text: 'Hoàn thành', value: 'Hoàn thành' },
        { text: 'Hủy', value: 'Hủy' },
        // Thêm các option khác nếu cần
      ],
      thoigiancapnhat: '',
      ChuKy: '',
      editedItem: {
        trangthai: null,
        hovaten: '',
        khoaphong: '',
        sodienthoai: '',
        thoigiantao: '',
        chitiet: '',
        vitri: '',
        chuky2: null,
        trangthai: '',
        nguoicapnhat: '',

        lydo: '',
      },
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
    window.addEventListener('resize', this.setCanvasSize)
    // Truyền thông tin của item từ route params vào biến editedItem
    this.getData()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.setCanvasSize)
  },
  methods: {
    getData(){
      const itemId = this.$route.params.id
    console.log(itemId)
    // Gọi endpoint để lấy thông tin của item
    this.$axios
      .get(`/getlistyeucau/${itemId}`)
      .then((response) => {
        // Lưu thông tin của item vào biến editedItem
        this.editedItem = response.data
        this.thoigiantao = response.data.thoigiantao

        this.ChuKy = response.data.chuky
        console.log(this.editedItem)
      })
      .catch((error) => {
        console.error('Error fetching item:', error)
      })
    },
    async saveChanges() {
      try {
        // Gửi thông tin của editedItem lên server
        const itemId = this.$route.params.id
        if (this.chuky2.isEmpty()) {
        this.showAlert('Chữ ký không được để trống', 'error')
        return
      }
        const updateData = {
          ...this.editedItem,
          nguoicapnhat: this.$store.state.auth.user.Name,
          chuky2: this.chuky2.toDataURL(),
        }

        const response = await this.$axios.put(
          `/updateyeucau/${itemId}`,
          updateData
        )

        // Hiển thị thông báo thành công
        this.showAlert('Cập nhật thành công!', 'success')
      } catch (error) {
        console.error('Error updating item:', error)
        // Hiển thị thông báo lỗi
        this.showAlert('Cập nhật thất bại. Vui lòng thử lại!', 'error')
      }
    },
    convertBase64ToImageUrl(base64Data) {
      // Kiểm tra nếu base64Data là null hoặc không xác định
      if (!base64Data) {
        return null // Trả về null nếu base64Data không có giá trị
      }

      // Kiểm tra xem base64Data có bắt đầu bằng 'data:image' không
      if (
        typeof base64Data === 'string' &&
        base64Data.startsWith('data:image')
      ) {
        return base64Data
      } else {
        return `data:image/png;base64,${base64Data}`
      }
    },
    formatDateTime(timeString) {
      return vnDateTimeFormat(timeString)
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
      this.chuky2 = new SignaturePad(canvas, {
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
      this.chuky2.clear()
    },
    clearForm(){
      getData()
    }
  },
}
</script>

<style>
/* Thêm kiểu dáng CSS nếu cần */
.signature-container {
  margin: 0 auto;
}
.signature-container canvas {
  display: block;
  width: 100% !important;
  height: auto !important;
}
.image-frame {
  margin: 20px 0;
  text-align: center;
}
.image-content {
  max-width: 100%;
  max-height: 150px; /* Giảm chiều cao tối đa */
  border: 1px solid #ccc; /* Viền xung quanh khung ảnh */
  object-fit: contain; /* Đảm bảo hình ảnh không bị cắt */
}
</style>
