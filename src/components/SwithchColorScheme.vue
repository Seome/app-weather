<template>
  <div class="wrapper">
    <div class="toggle">
      <input
        :class="{ checked: getColorScheme }"
        class="toggle-input"
        type="checkbox"
        @click="changeColorScheme()"
      />
      <div class="toggle-bg"></div>
      <div class="toggle-switch">
        <div class="toggle-switch-figure"></div>
        <div class="toggle-switch-figureAlt"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'switch-color-scheme',
  computed: mapGetters(['getColorScheme']),
  methods: mapMutations(['changeColorScheme']),
  mounted() {
    this.changeColorScheme();
  },
};
</script>

<style scoped>
* {
  box-sizing: content-box;
}

.wrapper {
  text-align: center;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 100px;
  padding: 4px;
  border-radius: 40px;
  transform: scale(0.5);
}

.toggle:before,
.toggle:after {
  content: '';
  display: table;
}

.toggle:after {
  clear: both;
}

.toggle-bg {
  position: absolute;
  top: -4px;
  left: -4px;
  width: 100%;
  height: 100%;
  border: 4px solid #81c0d5;
  border-radius: 40px;
  background-color: #c0e6f6;
  transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.toggle-input {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 40px;
  opacity: 0;
  cursor: pointer;
}

.toggle-switch {
  position: relative;
  width: 40px;
  height: 40px;
  margin-left: 50px;
  border: 4px solid #e4c74d;
  border-radius: 50%;
  background-color: #f5eb42;
  transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.toggle-switch-figure {
  position: absolute;
  bottom: -14px;
  left: -50px;
  display: block;
  width: 80px;
  height: 30px;
  border: 8px solid #d4d4d2;
  border-radius: 20px;
  background-color: #ffffff;
  transition: all 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: scale(0.4);
}

.toggle-switch-figure:after {
  content: '';
  position: relative;
  top: -65px;
  right: -42px;
  display: block;
  width: 15px;
  height: 15px;
  border: 8px solid #d4d4d2;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-radius: 100%;
  background-color: #ffffff;
  transform: rotateZ(70deg);
}

.toggle-switch-figure:before {
  content: '';
  position: relative;
  top: -25px;
  right: -10px;
  display: block;
  width: 30px;
  height: 30px;
  border: 8px solid #d4d4d2;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-radius: 100%;
  background-color: #ffffff;
  transform: rotateZ(30deg);
}

.toggle-switch-figureAlt {
  content: '';
  position: absolute;
  top: 5px;
  left: 2px;
  width: 2px;
  height: 2px;
  border: 4px solid #dee1c5;
  border-radius: 100%;
  background-color: #efeeda;
  box-shadow: 42px -7px 0 -3px #fcfcfc, 75px -10px 0 -3px #fcfcfc,
    54px 4px 0 -4px #fcfcfc, 83px 7px 0 -2px #fcfcfc, 63px 18px 0 -4px #fcfcfc,
    44px 28px 0 -2px #fcfcfc, 78px 23px 0 -3px #fcfcfc;
  transition: all 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: scale(0);
}

.toggle-switch-figureAlt:before {
  content: '';
  position: absolute;
  top: -6px;
  left: 18px;
  width: 7px;
  height: 7px;
  border: 4px solid #dee1c5;
  border-radius: 100%;
  background-color: #efeeda;
}

.toggle-switch-figureAlt:after {
  content: '';
  position: absolute;
  top: 19px;
  left: 15px;
  width: 2px;
  height: 2px;
  border: 4px solid #dee1c5;
  border-radius: 100%;
  background-color: #efeeda;
}

.toggle-input.checked ~ .toggle-switch {
  margin-left: 0;
  border-color: #dee1c5;
  background-color: #fffdf2;
}

.toggle-input.checked ~ .toggle-bg {
  border-color: #202020;
  background-color: #484848;
}

.toggle-input.checked ~ .toggle-switch .toggle-switch-figure {
  margin-left: 40px;
  opacity: 0;
  transform: scale(0.1);
}

.toggle-input.checked ~ .toggle-switch .toggle-switch-figureAlt {
  transform: scale(1);
}
</style>
