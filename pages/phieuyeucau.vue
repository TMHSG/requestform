<template>
  <v-app>

    <v-row>
      <v-menu
      ref="fromMenu"
      v-model="fromMenu"
      :close-on-content-click="false"
      :nudge-right="40"

      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="fromDate"
          label="Từ ngày"
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="fromDate"
        @input="fromMenu = false"
        :max="toDate"
      ></v-date-picker>
    </v-menu>

    <v-menu
      ref="toMenu"
      v-model="toMenu"
      :close-on-content-click="false"
      :nudge-right="40"

      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="toDate"
          label="Đến ngày"
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="toDate"
        @input="toMenu = false"
        :min="fromDate"
      ></v-date-picker>
    </v-menu>
    </v-row>
 <v-row>
    <v-btn
    color="blue lighten-2"
    dark
    class="mb-4 mr-4"
    @click="getListYeuCau1"
  >
    <v-icon dark>mdi-search-web</v-icon>
  </v-btn>
  <v-btn
    color="teal lighten-1"
    dark
    class="mb-4 mr-4"
    @click="exportToExcel"
  >
    <v-icon dark>mdi-file-excel</v-icon>
  </v-btn>
 </v-row>
   <v-row>
      <v-data-table
        :headers="headers"
        :items="listyeucau"
        :search="search"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>

        </template>
        <template v-slot:item.STT="{ item, index }">
          {{ index + 1 }}
        </template>
        <template v-slot:item.hovaten="{ item }">
          <v-chip :style="{ 'min-width': '100px' }" light>
            {{ item.hovaten }}
          </v-chip>
        </template>
        <template v-slot:item.chuky="{ item }">
          <img
            :src="convertBase64ToImageUrl(item.chuky)"
            alt="Chữ ký"
            style="max-width: 100px; max-height: 50px"
          />
        </template>
        <template v-slot:item.thoigiantao="{ item }">
          {{ formatDateTime(item.thoigiantao) }}
        </template>
        <template v-slot:item.thoigiancapnhat="{ item }">
          {{ formatDateTime(item.thoigiancapnhat) }}
        </template>
        <template v-slot:item.trangthai="{ item }">
          <v-chip :color="getStatusColor(item.trangthai)" light>
            {{ getStatusText(item.trangthai) }}
          </v-chip>
        </template>
        <template v-slot:item.chuky2="{ item }">
          <img
            :src="convertBase64ToImageUrl(item.chuky2)"
            alt="Chữ ký"
            style="max-width: 100px; max-height: 50px"
          />
        </template>
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Phiếu yêu cầu</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>

            <!-- <v-spacer></v-spacer> -->
            <v-text-field
            v-model="search"
            label="Tìm kiếm"
            single-line
            hide-details
          ></v-text-field>
            <v-btn
              color="cyan lighten-3"
              dark
              class="mb-4 mr-4"
              @click="getListYeuCau"
            >
            <v-icon dark> mdi-refresh </v-icon>
            </v-btn>

          </v-toolbar>
        </template>
        <template v-slot:item.hovaten="{ item }">
          <div class="wrap-text">
            {{ item.hovaten }}
          </div>
        </template>
        <template v-slot:item.vitri="{ item }">
          <div class="wrap-text">
            {{ item.vitri }}
          </div>
        </template>
        <template v-slot:item.sodienthoai="{ item }">
          <div class="wrap-text">
            {{ item.sodienthoai }}
          </div>
        </template>
        <template v-slot:item.chitiet="{ item }">
          <div class="wrap-text">
            {{ item.chitiet }}
          </div>
        </template>
        <template v-slot:item.lydo="{ item }">
          <div class="wrap-text">
            {{ item.lydo }}
          </div>
        </template>
        <template v-slot:item.nguoicapnhat="{ item }">
          <div class="wrap-text">
            {{ item.nguoicapnhat }}
          </div>
        </template>
      </v-data-table>
   </v-row>
  </v-app>
</template>

<script>
import { vnDateTimeFormat } from '~/utils/formatday.js'
import ExcelJS from 'exceljs'
export default {
  data() {
    return {
      listyeucau: [],
      search: '',
      fromDate: '',
      toDate: '',
      fromMenu: false,
      toMenu: false,
      headers: [
        { text: 'Actions', value: 'actions', sortable: false },
        { text: 'Stt', align: 'start', sortable: false, value: 'STT' },
        { text: 'Họ tên', value: 'hovaten' },
        { text: 'Khoa phòng', value: 'khoaphong' },
        { text: 'Vị trí', value: 'vitri' },
        { text: 'Điện thoại', value: 'sodienthoai' },
        { text: 'Chi tiết', value: 'chitiet' },
        { text: 'Chữ ký', value: 'chuky' },
        { text: 'Thời gian tạo', value: 'thoigiantao' },
        { text: 'Trạng thái', value: 'trangthai' },
        { text: 'Biện pháp', value: 'lydo' },
        { text: 'Người cập nhật', value: 'nguoicapnhat' },
        { text: 'Thời gian cập nhật', value: 'thoigiancapnhat' },
        { text: 'Chữ ký hoàn thành', value: 'chuky2' },
      ],
    }
  },
  created() {

  },
  mounted(){
    this.getListYeuCau()
  },
  methods: {
    async getListYeuCau() {
      try {
        const response = await this.$axios.get(`/getlistyeucau`)
        this.listyeucau = response.data
      } catch (error) {
        console.error(error)
      }
    },
    async getListYeuCau1() {

      try {
        const response = await this.$axios.get('/getlistyeucau1', {
          params: {
            TuNgay: this.fromDate,
            DenNgay: this.toDate
          }

        })
        this.listyeucau = response.data

      } catch (error) {
        console.error(error)
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
    getStatusColor(status) {
      return status === 'Chưa xác nhận'
        ? 'grey'
        : status === 'Đang thực hiện'
        ? 'yellow'
        : status === 'Hoàn thành'
        ? 'green'
        : status === 'Hủy'
        ? 'red'
        : 'default'
    },
    getStatusText(status) {
      return status === 'Chưa xác nhận'
        ? 'Chưa xác nhận'
        : status === 'Đang thực hiện'
        ? 'Đang thực hiện'
        : status === 'Hoàn thành'
        ? 'Hoàn thành'
        : status === 'Hủy'
        ? 'Hủy'
        : status
    },
    editItem(item) {
      // Chuyển hướng sang trang editphieuyeucau.vue với thông tin của item
      this.$router.push({
        name: 'editphieuyeucau',
        params: {
          id: item.id,
        },
      })
    },
    async exportToExcel() {
      const fileName = `Phieuyeucau${this.formatDateTime(
        this.TuNgay
      )}_${this.formatDateTime(this.DenNgay)}.xlsx`
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Sheet1')

      // Định dạng phông chữ

      // Định dạng ngày thành "dd/MM/yyyy"
      const dateFormat = 'dd/MM/yyyy'
      worksheet.getColumn('D').numFmt = dateFormat

      // Định dạng số thành "##,###"
      const numberFormat = '##,###'
      worksheet.getColumn('L').numFmt = numberFormat

      worksheet.addRow([
        'STT',
        'Họ và tên',
        'Khoa phòng',
        'Vị trí',
        'Số điện thoại',
        'cChi tiết',
        'Chữ ký 1',
        'Thời gian tạo',
        'Trạng thái',
        'Biện pháp khắc phục',
        'Người cập nhật',
        'Thời gian cập nhật',
        'Chữ ký 2',
      ])
      const font = { name: 'Times New Roman', size: 11 }

      // Áp dụng định dạng phông chữ cho toàn bộ worksheet
      worksheet.getRow(1).font = font
      // Thêm dữ liệu từ this.congkham vào tệp Excel
      this.listyeucau.forEach((item) => {
        const thoigiantao = new Date(item.thoigiantao)
        const thoigiantaoformat = this.formatDateTime(thoigiantao)
        const thoigiancapnhat = new Date(item.thoigiancapnhat)
        const thoigiancapnhatformat = this.formatDateTime(thoigiancapnhat)
        const row = worksheet.addRow([
          item.STT,
          item.hovaten,
          item.khoaphong,
          item.vitri,
          item.sodienthoai,
          item.chitiet,
          '',
          thoigiantaoformat,
          item.trangthai,
          item.lydo,
          item.nguoicapnhat,
          thoigiancapnhatformat,
          '',
        ])
        row.font = font
        if (item.chuky) {
      const imageId1 = workbook.addImage({
        base64: item.chuky,
        extension: 'png',
      })
      worksheet.addImage(imageId1, {
        tl: { col: 6, row: row.number - 1 },
        ext: { width: 100, height: 50 },
      })
    }

    // Thêm hình ảnh chữ ký 2
    if (item.chuky2) {
      const imageId2 = workbook.addImage({
        base64: item.chuky2,
        extension: 'png',
      })
      worksheet.addImage(imageId2, {
        tl: { col: 12, row: row.number - 1 },
        ext: { width: 100, height: 50 },
      })
    }
      })

      // Tạo một tệp Excel và lưu nó
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
    },
  },
}
</script>

<style>
/* Thêm kiểu dáng CSS nếu cần */
.wrap-text {
  white-space: normal !important;
  word-break: break-word !important;
}
.row {
  flex: 0 0
}
</style>
