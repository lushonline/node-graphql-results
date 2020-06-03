const app = new Vue({
  el: "#app",
  data: {
    chart: null,
    dates: [],
    temps: [],
    pressures: [],
    loading: false,
    errored: false,
    hoursback: 24,
  },
  mounted() {
    this.loading = true;

    if (this.chart != null) {
      this.chart.destroy();
    }

    const cursor = moment().subtract(this.hoursback, "hours").format();

    const getData = async function (cursor) {
      return new Promise(async function (resolve, reject) {
        let cursorToUse = cursor;
        const axiosConfig = {
          url: "graphql",
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };

        let edges = [];
        let keepGoing = true;

        while (keepGoing) {
          const query = `{results(cursor: "${cursorToUse}") {edges {createdAt,temperature,pressure} pageInfo {endCursor, hasNextPage}}}`;

          const variables = {};
          const requestBody = { query, variables };

          axiosConfig.data = { query, variables };

          try {
            const response = await axios.request(axiosConfig);
            const results = response.data.data.results;

            edges = [...edges, ...results.edges];

            if (!results.pageInfo.hasNextPage) {
              keepGoing = false;
            }
            cursorToUse = results.pageInfo.endCursor;
          } catch (error) {
            reject(error);
          }
        }
        resolve(edges);
      });
    };

    getData(cursor)
      .then((edges) => {
        this.dates = edges.map((edge) => {
          return edge.createdAt;
        });

        this.temps = edges.map((edge) => {
          return edge.temperature;
        });

        this.pressures = edges.map((edge) => {
          return edge.pressure / 100;
        });

        const ctx = document.getElementById("myChart");
        this.chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: this.dates,
            datasets: [
              {
                label: "Temperature",
                units: "°C",
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgb(54, 162, 235)",
                fill: false,
                data: this.temps,
                yAxisID: "temperature-axis",
              },
              {
                label: "Pressure",
                units: "hPa",
                backgroundColor: "rgba(235, 127, 54, 0.5)",
                borderColor: "rgb(235, 127, 54)",
                fill: false,
                data: this.pressures,
                yAxisID: "pressure-axis",
              },
            ],
          },
          options: {
            title: {
              display: true,
              text: "Temperature & Pressure",
            },
            tooltips: {
              callbacks: {
                label(tooltipItem, data) {
                  let label =
                    data.datasets[tooltipItem.datasetIndex].label || "";
                  let units =
                    data.datasets[tooltipItem.datasetIndex].units || "";
                  if (label) {
                    label += ": ";
                  }

                  label += Math.floor(tooltipItem.yLabel);
                  return `${label}${units}`;
                },
              },
            },
            scales: {
              xAxes: [
                {
                  type: "time",
                  time: {
                    unit: "hour",
                    displayFormats: {
                      hour: "ddd HH:mm:ss",
                    },
                    tooltipFormat: "LLLL",
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "Date/Time",
                  },
                },
              ],
              yAxes: [
                {
                  position: "left",
                  scaleLabel: {
                    display: true,
                    labelString: "Temperature (°C)",
                  },
                  ticks: {
                    callback(value, index, values) {
                      return `${value}°C`;
                    },
                  },
                  id: "temperature-axis",
                },
                {
                  position: "right",
                  scaleLabel: {
                    display: true,
                    labelString: "Pressure (hPa)",
                  },
                  ticks: {
                    callback(value, index, values) {
                      return `${value} hPa`;
                    },
                  },
                  id: "pressure-axis",
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
