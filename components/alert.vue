<template>
  <v-alert v-model="visible" :type="type" dismissible class="alert-center">
    {{ message }}
  </v-alert>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      visible: true
    }
  }
}
</script>
<style scoped>
.alert-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  width: 80%;
  max-width: 400px;
}
</style>
