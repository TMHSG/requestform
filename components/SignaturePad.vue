<template>
  <div>
    <canvas ref="canvas" width="400" height="200"></canvas>
    <button @click="saveSignature">Save</button>
  </div>
</template>

<script>
import SignaturePad from 'signature_pad';

export default {
  data() {
    return {
      signaturePad: null
    };
  },
  mounted() {
    this.signaturePad = new SignaturePad(this.$refs.canvas, {
      backgroundColor: 'rgb(255, 255, 255)',
      penColor: 'rgb(0, 0, 0)'
    });
  },
  methods: {
    saveSignature() {
      const signatureData = this.signaturePad.toDataURL();
      console.log(signatureData);
      // Gửi dữ liệu chữ ký tới server hoặc xử lý dữ liệu theo nhu cầu của bạn
    }
  }
};
</script>
