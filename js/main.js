if (typeof (Storage) == "undefined") {
    $("#no-storage-modal").modal('toggle');
}

if (getItem("name") == undefined) {
    $("#enter-channel-name-modal").modal('toggle');

    $("#username-input").on('input', function () {
        if ($("#username-input").val().length != 0) {
            $("#username-submit-button").prop('disabled', false);
        } else {
            $("#username-submit-button").prop('disabled', true);
        }
    });

    //Only add the listener if the input is needed
    $("#username-submit-button").click(function () {
        $("#enter-channel-name-modal").modal('toggle');

        //Start the mixer collection process
        startMixer($("#username-input").val());
    });
} else {
    startMixer(getItem("name")); //Start collecting with the username in session storage

    //Set previous values
    $("#peak-viewer-count").text(getItem("peak-viewers"));
    $("#net-follower-gain").text(getItem("new-followers"));
    $("#unique-viewer-number").text(getItem("new-viewers"));
}

var ca;
var liveViewerChart;

var uniqueViewers = 0;
var newFollowers = 0;
var peakViewers = 0;

function startMixer(channel) {
    $.get("http://mixer.com/api/v1/channels/" + channel, function (data) {}).done(function (data) {
        if (data.statusCode == 404) {
            alert("Name not found, please enter a correct channel name!");
            location.reload();
        }

        setItem("name", data.token);
        setItem("channel-id", data.id);
        setItem("user-id", data.user.id);
        setItem("starting-viewer-total", data.viewersTotal);
        setItem("starting-follower-number", data.numFollowers);
        setItem("peak-viewers", data.viewersCurrent);
        setItem("new-followers", 0);
        setItem("new-viewers", 0);

        startCarina(data.id);
        startViewerTracking(data.viewersCurrent);

        // Set username in the top right
        $("#mixer-username").text(data.token);
    }).fail(function () {
        alert("Error ~ please refresh.");
        location.reload();
    });
}

function startCarina(id) {
    ca = new carina.Carina().open();
    ca.subscribe('channel:' + id + ':update', function (data) {
        if (data.viewersCurrent != undefined) {
            if (data.viewersCurrent > getItem("peak-viewers")) {
                setItem("peak-viewers", data.viewersCurrent);
                $("#peak-viewer-count").text(getItem("peak-viewers"));
            }
        }

        if (data.viewersTotal != undefined) {
            setItem("new-viewers", (data.viewersTotal - getItem("starting-viewer-total")));
            $("#unique-viewer-number").text(getItem("new-viewers"));
        }

        console.log(data);
    });

    ca.subscribe('channel:' + id + ':followed', function (data) {
        if (data.following) {
            setItem("new-followers", parseInt(getItem("new-followers")) + 1);
        } else {
            setItem("new-followers", parseInt(getItem("new-followers")) - 1);
        }

        $("#net-follower-gain").text(getItem("new-followers"));
    });
}

function startViewerTracking(currentViewers) {
    liveViewerChart = new Chart($("#live-viewer-chart"), {
        type: 'line',
        data: {
            labels: [''],
            datasets: [{
                data: [],
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

    $.get("http://mixer.com/api/v1/channels/" + getItem("name"), function () {

    }).done(function (data) {
        if (data.viewersCurrent - 30 <= 0) {
            liveViewerChart.options.scales.yAxes[0].ticks.min = 0;
        } else {
            liveViewerChart.options.scales.yAxes[0].ticks.min = parseInt((data.viewersCurrent - 30) / 10, 10) * 10;
        }

        liveViewerChart.options.scales.yAxes[0].ticks.max = parseInt((data.viewersCurrent + 30) / 10, 10) * 10;

        pushToChart(liveViewerChart, getHumanDate(), data.viewersCurrent);
    }).fail(function (data) {
        //Do nothing for now
    });

    setInterval(function () {
        $.get("http://mixer.com/api/v1/channels/" + getItem("name"), function () {

        }).done(function (data) {
            pushToChart(liveViewerChart, getHumanDate(), data.viewersCurrent);
        }).fail(function (data) {
            //Do nothing for now
        });
    }, 60000);
}

/**
 * Pushes new information the provided ChartJS chart
 * In this case the label will be a timestamp/date and the data will be the viewer count
 * 
 * @param {any} chart The chart object
 * @param {any} label The label for the data
 * @param {any} data The data to be inserted into the dataset
 */
function pushToChart(chart, label, data) {
    if (chart.data.labels.length > 15) {
        chart.data.labels.splice(0, 1);
        chart.data.datasets[0].data.splice(0, 1);
    }

    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data);

    if (data <= (liveViewerChart.options.scales.yAxes[0].ticks.min + 10)) {
        if (data - 30 <= 0) {
            liveViewerChart.options.scales.yAxes[0].ticks.min = 0;
        } else {
            liveViewerChart.options.scales.yAxes[0].ticks.min = parseInt((data - 30) / 10, 10) * 10;
        }
    }

    if (data >= (liveViewerChart.options.scales.yAxes[0].ticks.max - 10)) {
        liveViewerChart.options.scales.yAxes[0].ticks.max = parseInt((data + 30) / 10, 10) * 10;
    }

    chart.update();
}

function getHumanDate() {
    return new Date().toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
}