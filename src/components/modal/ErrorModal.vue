<template>
  <div class="modal-message">
    <div class="massage" v-html="getError"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ErrorModal',
  computed: mapGetters(['getError']),
};
</script>

<style scoped>
.modal-message {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #212529;
}

.massage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  font-size: 32px;
  color: #ffffff;
}
</style>
