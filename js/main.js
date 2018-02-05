if (typeof (Storage) == "undefined") {
    $("#no-storage-modal").modal('toggle');
}

var data = {
    labels: ['2018-02-04 12:00:00', '2018-02-04 12:05:00', '2018-02-04 12:10:00', '2018-02-04 12:15:00', '2018-02-04 12:20:00', '2018-02-04 12:25:00', '2018-02-04 12:30:00', '2018-02-04 12:35:00', '2018-02-04 12:40:00', '2018-02-04 12:45:00'],
    series: [
        [10, 22, 18, 16, 20, 13, 15, 17, 15, 7]
    ]
};

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
        }
    }
})

//Initialize session storage