<template>
  <div class="confirm-modal">
    <div class="massage">
      Are you sure you want to delete the block?
      <div class="btn-container">
        <button @click="closeModal(true)" class="btn-yes">YES</button>
        <button @click="closeModal(false)" class="btn-no">NO</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ErrorModal',
  computed: mapGetters(['getError']),
  methods: {
    closeModal(val) {
      this.$emit('closeModal', val);
    },
  },
};
</script>

<style scoped>
.confirm-modal {
  position: fixed;
  z-index: 9999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #212529;
}

.massage {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  color: #ffffff;
  font-weight: bold;
  font-size: 32px;
  transform: translate(-50%, -50%);
}

.btn-container {
  margin-top: 20px;
}

button {
  display: inline-block;
  min-width: 100px;
  margin-right: 20px;
  padding: 10px 12px;
  padding: 12px;
  border: 0 solid #000000;
  border-radius: 3px;
  background: #2196f3;
  color: #ffffff;
  text-decoration: none;
  font-weight: bold;
  font-weight: 100;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.btn-yes {
  background: #b80811;
}
</style>
