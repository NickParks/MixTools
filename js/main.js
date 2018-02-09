if (typeof (Storage) == "undefined") {
    $("#no-storage-modal").modal('toggle');
}

//Check if a name already exists in sessionStorage 
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

var liveViewerChart;

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
        setItem("recent-messages", JSON.stringify([]));
        setItem("unique-chatters", JSON.stringify([]));

        startCarina(data.id);
        startViewerTracking(data.viewersCurrent);
        connectToChat(data.id);

        // Set username in the top right
        $("#mixer-username").text(data.token);
    }).fail(function () {
        alert("Error ~ please refresh.");
        location.reload();
    });
}

function startViewerTracking(currentViewers) {
    liveViewerChart = new Chart($("#live-viewer-chart"), {
        type: 'line',
        data: {
            labels: [],
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

        pushToChart(liveViewerChart, getLocalTime(), data.viewersCurrent);
    }).fail(function (data) {
        //Do nothing for now
    });

    setInterval(function () {
        $.get("http://mixer.com/api/v1/channels/" + getItem("name"), function () {

        }).done(function (data) {
            pushToChart(liveViewerChart, getLocalTime(), data.viewersCurrent);
        }).fail(function (data) {
            //Do nothing for now
        });
    }, 60000);
}

//Logout listener
$("#logout-button").on('click', (event) => {
    logout();
});