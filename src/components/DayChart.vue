<template>
  <div class="chart">
    <div class="wrapper-chart">
      <canvas id="myChart"></canvas>
      <div v-if="map" class="description-chart">
        <p v-for="val in tempValues" :key="val">{{ Math.round(val) }}°C</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  props: {
    data: Object,
  },
  data() {
    return {
      map: new Map(),
    };
  },
  computed: {
    tempValues() {
      let temp = [];
      const values = this.map.values();
      for (let i = 0; i < this.map.size; i++) {
        temp.push(values.next().value);
      }
      return temp;
    },
  },
  methods: {
    calculateNext5Days() {
      this.map = new Map();
      for (let val of this.data.list) {
        if (this.map.size == 9) {
          break;
        }

        let data = val.dt_txt.split(' ')[1].substr(0, 5);

        if (!this.map.has(data)) {
          this.map.set(data, val.main.temp);
        } else {
          if (this.map.get(data) < val.main.temp) {
            this.map.set(data, val.main.temp);
          }
        }
      }
    },
  },
  mounted() {
    this.calculateNext5Days();
    const keys = this.map.keys();
    const values = this.map.values();

    Chart.defaults.color = '#ffffff';

    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          keys.next().value,
          keys.next().value,
          keys.next().value,
          keys.next().value,
          keys.next().value,
          keys.next().value,
          keys.next().value,
          keys.next().value,
        ],
        datasets: [
          {
            data: [
              Math.round(values.next().value),
              Math.round(values.next().value),
              Math.round(values.next().value),
              Math.round(values.next().value),
              Math.round(values.next().value),
              Math.round(values.next().value),
              Math.round(values.next().value),
              Math.round(values.next().value),
            ],
            backgroundColor: '#1266F1',
            borderColor: 'rgba(255, 255, 255, 1)',
            color: 'rgba(255, 255, 255, 1)',
            borderWidth: 3,
            tension: 0.5,
          },
        ],
      },
      options: {
        plugins: {
          legend: false,
          tooltip: {
            enabled: false,
          },
        },
        scales: {
          y: {
            display: true,
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  },
};
</script>

<style scoped>
.wrapper-chart {
  margin: 50px auto 0;
  padding: 0 0 40px 0;
}

#myChart {
  width: 100% !important;
  max-width: 900px;
  max-height: 200px;
  margin: 0 auto;
}

.description-chart {
  display: flex;
  justify-content: space-between;
  max-width: 900px;
  margin: 0 auto;
  color: #ffffff;
}

@media (max-width: 425px) {
  .description-chart p {
    font-size: 12px;
  }
}
</style>
