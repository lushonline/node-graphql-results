const app = new Vue({
  el: '#app',
  data: {
    chart: null,
    dates: [],
    temps: [],
    loading: false,
    errored: false,
  },
  mounted() {
    this.loading = true;

    if (this.chart != null) {
      this.chart.destroy();
    }

    const cursor = moment().subtract(6, 'hours').format();

    const query = `
    {
      results(cursor: "${cursor}") {
        edges {
          id,
          createdAt,
          temperature,
          pressure
        }
        pageInfo {
          endCursor,
          hasNextPage
        }
      }
    }
  `;

    const variables = {};

    const requestBody = { query, variables };

    const axiosConfig = {
      url: 'graphql',
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestBody,
    };

    axios
      .request(axiosConfig)
      .then((response) => {
        this.dates = response.data.results.edges.map((edges) => {
          return edges.createdAt;
        });

        this.temps = response.data.results.edges.map((edges) => {
          return edges.temperature;
        });

        const ctx = document.getElementById('myChart');
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.dates,
            datasets: [
              {
                label: 'Temperature',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgb(54, 162, 235)',
                fill: false,
                data: this.temps,
              },
            ],
          },
          options: {
            title: {
              display: true,
              text: 'Temperature',
            },
            tooltips: {
              callbacks: {
                label(tooltipItem, data) {
                  let label = data.datasets[tooltipItem.datasetIndex].label || '';

                  if (label) {
                    label += ': ';
                  }

                  label += Math.floor(tooltipItem.yLabel);
                  return `${label}°C`;
                },
              },
            },
            scales: {
              xAxes: [
                {
                  type: 'time',
                  time: {
                    unit: 'hour',
                    displayFormats: {
                      hour: 'LLLL',
                    },
                    tooltipFormat: 'LLLL',
                  },
                  scaleLabel: {
                    display: true,
                    labelString: 'Date/Time',
                  },
                },
              ],
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Temperature (°C)',
                  },
                  ticks: {
                    callback(value, index, values) {
                      return `${value}°C`;
                    },
                  },
                },
              ],
            },
          },
        });
      })
      .catch((error) => {
        console.log(error);
        this.errored = true;
      })
      .finally(() => (this.loading = false));
  },
});
