function renderChart(ctx, data) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.date,
      datasets: [
        {
          label: 'Temperature',
          units: '°C',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          fill: false,
          data: data.temperature,
          yAxisID: 'temperature-axis',
        },
        {
          label: 'Pressure',
          units: 'hPa',
          backgroundColor: 'rgba(235, 127, 54, 0.5)',
          borderColor: 'rgb(235, 127, 54)',
          fill: false,
          data: data.pressure,
          yAxisID: 'pressure-axis',
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: 'Temperature & Pressure',
      },
      tooltips: {
        callbacks: {
          label(tooltipItem, data) {
            let label = data.datasets[tooltipItem.datasetIndex].label || '';
            let units = data.datasets[tooltipItem.datasetIndex].units || '';
            if (label) {
              label += ': ';
            }

            label += Math.floor(tooltipItem.yLabel);
            return `${label}${units}`;
          },
        },
      },
      scales: {
        xAxes: [
          {
            type: 'time',
            time: {
              unit1: 'hour',
              stepSize1: 3,
              displayFormats: {
                day: 'MMMM Do YYYY',
                hour: 'MMMM Do YYYY, HH:00:00',
                minute: 'MMMM Do YYYY, HH:mm:00',
                second: 'MMMM Do YYYY, HH:mm:ss',
              },
              tooltipFormat: 'LLLL',
            },
            scaleLabel: {
              display: true,
              labelString: 'Date/Time',
            },
            ticks: {
              autoSkip: true,
              autoSkipPadding: 50,
            },
          },
        ],
        yAxes: [
          {
            position: 'left',
            gridLines: {
              drawOnChartArea: false,
            },
            scaleLabel: {
              display: true,
              labelString: 'Temperature (°C)',
            },
            ticks: {
              callback(value, index, values) {
                return `${value}°C`;
              },
            },
            id: 'temperature-axis',
          },
          {
            position: 'right',
            gridLines: {
              drawOnChartArea: false,
            },
            scaleLabel: {
              display: true,
              labelString: 'Pressure (hPa)',
            },
            ticks: {
              callback(value, index, values) {
                return `${value} hPa`;
              },
            },
            id: 'pressure-axis',
          },
        ],
      },
      plugins: {
        zoom: {
          zoom: {
            enabled: true,
            drag: {
              animationDuration: 1000,
            },
            mode: 'x',
            speed: 0.05,
          },
          pan: {
            enabled: false,
            mode: 'x',
            threshold: 10,
          },
        },
      },
    },
  });
}

async function getData(graphql = 'graphql', cursor) {
  return new Promise(async function (resolve, reject) {
    const axiosConfig = {
      url: graphql,
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: {
        query: `{results(cursor: "${cursor}") {edges {createdAt,temperature,pressure} pageInfo {endCursor, hasNextPage}}}`,
        variables: {},
      },
    };

    try {
      const response = await axios.request(axiosConfig);
      // response.data = Axios JSON parsed response
      // response.data.data = The data object in the JSON response from graphql
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
}

function getAllData(graphql = 'graphql', startCursor) {
  return new Promise(async function (resolve, reject) {
    let cursor = startCursor.format();
    let edges = [];
    let keepGoing = true;
    let data = {
      date: [],
      temperature: [],
      pressure: [],
    };

    while (keepGoing) {
      try {
        const response = await getData(graphql, cursor);
        const results = response.data.results;
        edges = [...edges, ...results.edges];

        if (!results.pageInfo.hasNextPage) {
          keepGoing = false;
          data.date = edges.map((edge) => {
            return edge.createdAt;
          });

          data.temperature = edges.map((edge) => {
            return edge.temperature;
          });

          data.pressure = edges.map((edge) => {
            return edge.pressure / 100;
          });
          resolve(data);
        }
        cursor = results.pageInfo.endCursor;
      } catch (error) {
        keepGoing = false;
        reject(error);
      }
    }
  });
}

$(function () {
  var ctx = $('#myChart')[0].getContext('2d');
  var graphql = 'graphql';
  var cursor = moment().subtract(24, 'hours');
  var chart = null;

  $('#previousDayBtn').click(function () {
    cursor = cursor.subtract(24, 'hours');
    getAllData(graphql, cursor)
      .then(function (data) {
        if (data.date.length > 0) {
          $('#loadingMessage').addClass('d-none');

          // Now we add the new data to start
          chart.resetZoom();
          chart.data.labels = data.date;
          chart.data.datasets[0].data = data.temperature;
          chart.data.datasets[1].data = data.pressure;
          chart.update();
          $('#controls').removeClass('d-none');
        }
      })
      .catch(function (err) {
        $('#loadingMessage').addClass('d-none');
        $('#errorMessage').removeClass('d-none');
      });
  });

  $('#resetZoomBtn').click(function () {
    chart.resetZoom();
  });

  getAllData(graphql, cursor)
    .then(function (data) {
      if (data.date.length > 0) {
        $('#loadingMessage').addClass('d-none');
        chart = renderChart(ctx, data);
        $('#controls').removeClass('d-none');
      }
    })
    .catch(function (err) {
      $('#loadingMessage').addClass('d-none');
      $('#errorMessage').removeClass('d-none');
    });
});
