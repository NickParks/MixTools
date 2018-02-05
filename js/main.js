if (typeof (Storage) == "undefined") {
    $("#no-storage-modal").modal('toggle');
}

var ca;

var startingViewerCount = 0;

var uniqueViewers = 0;
var newFollowers = 0;
var peakViewers = 0;

var ctx = $("#myChart");

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
    $.get("http://mixer.com/api/v1/channels/" + channel, function (data) {}).done(function (data) {
        console.log(data);

        if (data.statusCode == 404) {
            alert("Name not found, please enter a correct channel name!");
            location.reload();
        }

        setItem("name", data.token);
        setItem("channel-id", data.id);
        setItem("user-id", data.user.id);
        setItem("starting-viewer-total", data.viewersTotal);
        setItem("starting-follower-number", data.numFollowers);

        startingViewerCount = data.viewersTotal;

        startCarina(data.id);

    }).fail(function () {
        alert("Error ~ please refresh.");
        location.reload();
    });
}

function startCarina(id) {
    ca = new carina.Carina().open();
    ca.subscribe('channel:' + id + ':update', function (data) {
        if (data.viewersCurrent != undefined) {
            if (data.viewersCurrent > peakViewers) {
                peakViewers = data.viewersCurrent;
                $("#peak-viewer-count").text(peakViewers);
            }
        }

        if (data.viewersTotal != undefined) {
            $("#unique-viewer-number").text((data.viewersTotal - startingViewerCount));
        }

        console.log(data);
    });

    ca.subscribe('channel:' + id + ':followed', function (data) {
        if (data.following) {
            newFollowers++;
        } else {
            newFollowers--;
        }

        $("#net-follower-gain").text(newFollowers);
    });
}