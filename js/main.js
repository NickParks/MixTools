var liveViewerChart;

$(document).ready(function () {
    if (typeof (Storage) == "undefined") {
        $("#no-storage-modal").modal('toggle');
    }

    //Load our main content
    $("#page-wrapper").load("main.html", function (response, status, xhr) {
        setupListeners();

        if (status == "success") {
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
                //Start tracking again
                startCarina(getItem("channel-id"));
                connectToChat(getItem("channel-id"));

                // Set username in the top right
                $("#mixer-username").text(getItem("name"));
            }
        } else {
            console.log("idk");
        }
    });

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
            setItem("session-viewer-counts", JSON.stringify([]));
            setItem("chart-data", JSON.stringify([]));
            setItem("recent-messages", JSON.stringify([]));
            setItem("unique-chatters", JSON.stringify([]));

            startCarina(data.id);
            initChart();
            connectToChat(data.id);

            // Set username in the top right
            $("#mixer-username").text(data.token);
        }).fail(function () {
            alert("Error ~ please refresh.");
            location.reload();
        });
    }
});

function setupListeners() {
    //Logout listener
    $("#logout-button").on('click', (event) => {
        logout();
    });

    //For loading HTML into wrapper without refreshing/losing data
    $("a").on('click', function (event) { //Cannot use ES6 due to the loss of 'this'
        if ($(this).attr('id') == "logout-button") { // Allow logout button to function properly
            return;
        }

        event.preventDefault();

        var href = $(this).attr('href');

        if (href != window.location.href) {
            $("#page-wrapper").load(href, function (response, status, xhr) {});
        }
    });
}

function initChart() {
    if (liveViewerChart == undefined) {
        liveViewerChart = createChart("#live-viewer-chart");
    }

    $.get("http://mixer.com/api/v1/channels/" + getItem("name"), function () {}).done(function (data) {
        if (data.viewersCurrent - 30 <= 0) {
            liveViewerChart.options.scales.yAxes[0].ticks.min = 0;
        } else {
            liveViewerChart.options.scales.yAxes[0].ticks.min = parseInt((data.viewersCurrent - 30) / 10, 10) * 10;
        }

        liveViewerChart.options.scales.yAxes[0].ticks.max = parseInt((data.viewersCurrent + 30) / 10, 10) * 10;

        pushToChart(liveViewerChart, getLocalTime(), data.viewersCurrent);
        startChartTimer();
    }).fail(function (data) {
        //Do nothing for now
    });
}

function startChartTimer() {
    setInterval(function () {
        $.get("http://mixer.com/api/v1/channels/" + getItem("name"), function () {

        }).done(function (data) {
            pushToChart(liveViewerChart, getLocalTime(), data.viewersCurrent);
        }).fail(function (data) {
            //Do nothing for now
        });
    }, 60000); //Every 60 seconds
}