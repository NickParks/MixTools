if (typeof (Storage) == "undefined") {
    $("#no-storage-modal").modal('toggle');
}

var ctx = $("#myChart");
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Noon', 'Noon', 'Noon', 'Noon', 'Noon', 'Noon', 'Noon', 'Noon', 'Noon', 'Noon'],
        datasets: [{
            data: [10, 22, 18, 16, 20, 13, 15, 17, 15, 7],
            label: "Viewers",
            borderColor: "#0B62A4",
            backgroundColor: "#2677B5",
            fill: true
        }]
    },
    options: {
        title: {
            display: false
        },
        legend: {
            display: false
        }
    }
});

/**
 * Pushes new information the provided ChartJS chart
 * In this case the label will be a timestamp/date and the data will be the viewer count
 * 
 * @param {any} chart The chart object
 * @param {any} label The label for the data
 * @param {any} data The data to be inserted into the dataset
 */
function pushToChart(chart, label, data) {
    chart.data.labels.splice(0, 1);
    chart.data.datasets[0].data.splice(0, 1);

    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data);

    chart.update();
}

function startMixer(channel) {
    $.get("http://mixer.com/api/v1/channels/" + channel, function (data) {
        console.log(data);

        setItem("name", channel);
    }).fail(function () {
        alert("Error ~ please refresh.");
    });
}

//Initialize session storage